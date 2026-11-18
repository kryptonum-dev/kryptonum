import { useState, useEffect, useRef } from 'react';
import { useForm, type FieldValues } from 'react-hook-form';
import Input from '@repo/ui/Input'
import Checkbox from '@repo/ui/Checkbox'
import Select from '@repo/ui/Select'
import { REGEX, DOMAIN } from '@repo/shared/constants';
import { sendContactEmail, type Props as sendContactEmailProps } from '@apps/www/pages/api/contact/sendContactEmail';
import { type Language } from '@repo/shared/languages';
import { trackEvent, updateAnalyticsUser } from '../../../analytics';
import { getUtmForSheet } from '../../../analytics/utm-storage';
import { getMetaIdsForSheet, shouldTrackAnalytics } from './helpers';
import LeadForm, { type LeadVariant } from './LeadForm';

type LegacyVariant = 'form-with-list' | 'form-with-person' | 'form-lead' | 'form-influencer';
type Variant = LegacyVariant | LeadVariant;

type Props = {
  children: React.ReactNode,
  variant: Variant;
  lang: Language
  dropdownOptions?: string[]
  dropdownLabel?: string
  dropdownPlaceholder?: string
  formId?: string
} & React.FormHTMLAttributes<HTMLFormElement>

const translations = {
  pl: {
    emailRequired: 'Email jest wymagany',
    emailInvalid: 'Niepoprawny adres e-mail',
    messageLabel: 'Temat rozmowy',
    messagePlaceholder: 'Daj znać, o czym porozmawiamy',
    messageRequired: 'Temat jest wymagany',
    legal: <>Akceptuję <a href={`${DOMAIN}/pl/polityka-prywatnosci`} target="_blank" rel="noopener noreferrer" className="link">politykę prywatności</a></>,
    legalRequired: 'Zgoda jest wymagana',
    phoneLabel: 'Twój numer telefonu',
    phonePlaceholder: '+48 ___ ___ ___',
    phoneRequired: 'Numer telefonu jest wymagany',
    phoneInvalid: 'Niepoprawny numer telefonu',
    dropdownRequired: 'To pole jest wymagane',
    nameLabel: 'Imię i nazwisko',
    nameRequired: 'Imię i nazwisko jest wymagane',
    totalFollowersLabel: 'Liczba obserwujących',
    totalFollowersPlaceholder: 'np. 50k TikTok, 12k Instagram',
    totalFollowersRequired: 'Liczba obserwujących jest wymagana',
    socialMediaLinksLabel: 'Linki do profili social media',
    socialMediaLinksPlaceholder: 'Wklej linki do swoich profili (każdy w nowej linii)',
    socialMediaLinksRequired: 'Linki do profili są wymagane',
    publishedVideosLabel: 'Ile opublikowanych wideo',
    publishedVideosRequired: 'To pole jest wymagane',
    exampleVideoLabel: 'Przykładowy film lub link',
    exampleVideoPlaceholder: 'https://',
  },
  en: {
    emailRequired: 'Email is required',
    emailInvalid: 'Invalid email address',
    messageLabel: 'Subject',
    messagePlaceholder: 'Let us know what we will talk about',
    messageRequired: 'Message is required',
    legal: <>I accept <a href={`${DOMAIN}/en/privacy-policy`} target="_blank" rel="noopener noreferrer" className="link">privacy policy</a></>,
    legalRequired: 'Consent is required',
    phoneLabel: 'Your phone number',
    phonePlaceholder: '+48 ___ ___ ___',
    phoneRequired: 'Phone number is required',
    phoneInvalid: 'Invalid phone number',
    dropdownRequired: 'This field is required',
    nameLabel: 'Full name',
    nameRequired: 'Full name is required',
    totalFollowersLabel: 'Total followers',
    totalFollowersPlaceholder: 'e.g. 50k TikTok, 12k Instagram',
    totalFollowersRequired: 'Total followers count is required',
    socialMediaLinksLabel: 'Social media profile links',
    socialMediaLinksPlaceholder: 'Paste links to your profiles (each on a new line)',
    socialMediaLinksRequired: 'Social media links are required',
    publishedVideosLabel: 'Published videos',
    publishedVideosRequired: 'This field is required',
    exampleVideoLabel: 'Example video or link',
    exampleVideoPlaceholder: 'https://',
  },
}

const hasMultiStep = (variant: LegacyVariant) => variant === 'form-with-person' || variant === 'form-lead' || variant === 'form-influencer';

const publishedVideosOptions = ['0-10', '10-30', '30-100', '100+'];

export default function Form(props: Props) {
  const { variant } = props;
  if (variant === 'form-creator' || variant === 'form-site') {
    const { dropdownOptions, dropdownLabel, dropdownPlaceholder, ...leadProps } = props;
    return <LeadForm {...leadProps} variant={variant} />;
  }
  return <LegacyForm {...props} variant={variant} />;
}

function LegacyForm({ children, variant, lang, dropdownOptions, dropdownLabel, dropdownPlaceholder, formId, ...props }: Props & { variant: LegacyVariant }) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [step, setStep] = useState<1 | 2>(1);
  const formName = `contact_form_${variant}`;
  const leadSaved = useRef(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    trigger,
    setFocus,
  } = useForm({ mode: 'onTouched' });

  useEffect(() => {
    const tryAgain = () => setStatus('idle');
    document.addEventListener('Contact-TryAgain', tryAgain);
    if (hasMultiStep(variant)) {
      const nextStep = async () => {
        const fieldsToValidate = variant === 'form-lead'
          ? (['phone', 'dropdown'] as const)
          : variant === 'form-influencer'
            ? (['fullName', 'email'] as const)
            : (['message'] as const);
        const isValid = await trigger(fieldsToValidate as unknown as string[]);
        if (isValid) {
          setStep(2);
          requestAnimationFrame(() => setFocus(variant === 'form-influencer' ? 'totalFollowers' : 'email'));
        }
      }
      const prevStep = () => {
        setStep(1);
        requestAnimationFrame(() => setFocus(
          variant === 'form-lead' ? 'phone'
            : variant === 'form-influencer' ? 'fullName'
              : 'message'
        ));
      }
      document.addEventListener('Contact-NextStep', nextStep);
      document.addEventListener('Contact-PrevStep', prevStep);
      return () => {
        document.removeEventListener('Contact-TryAgain', tryAgain);
        document.removeEventListener('Contact-NextStep', nextStep);
        document.removeEventListener('Contact-PrevStep', prevStep);
      }
    }
    return () => document.removeEventListener('Contact-TryAgain', tryAgain);
  }, []);

  const onSubmit = async (data: FieldValues) => {
    setStatus('loading');

    if (!leadSaved.current) {
      const saveLead = () => fetch(`${DOMAIN}/api/s3d`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: data.email,
          message: data.message,
          phone: data.phone,
          dropdown: data.dropdown,
          fullName: data.fullName,
          totalFollowers: data.totalFollowers,
          socialMediaLinks: data.socialMediaLinks,
          publishedVideos: data.publishedVideos,
          exampleVideo: data.exampleVideo,
          formId,
          utm: getUtmForSheet(),
          metaIds: getMetaIdsForSheet(),
          source: typeof window !== 'undefined' ? window.location.hostname + window.location.pathname : '',
        }),
        keepalive: true,
      }).then((response) => response.ok).catch(() => false);

      leadSaved.current = await saveLead();
      if (!leadSaved.current) {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        leadSaved.current = await saveLead();
        if (!leadSaved.current) console.error('[Form] Lead save failed twice, submission continues via email only');
      }
    }

    const response = await sendContactEmail({
      ...data,
      formId,
    } as sendContactEmailProps);
    if (response.success) {
      setStatus('success');
      reset();
      leadSaved.current = false;
      if (typeof fathom !== 'undefined') fathom.trackEvent('contactForm_submit');
      if (shouldTrackAnalytics()) {
        updateAnalyticsUser({ email: data.email as string, phone: data.phone as string });
        const user = {
          email: data.email as string,
          phone: data.phone as string,
        };
        trackEvent({
          user,
          meta: {
            eventName: 'Lead',
            contentName: 'contact_form',
            params: {
              form_name: formName,
            }
          },
          ga4: {
            eventName: 'generate_lead',
            params: {
              form_name: formName,
            }
          }
        });
      }
    } else {
      setStatus('error');
      if (typeof fathom !== 'undefined') fathom.trackEvent('contactForm_error');
    }
  };

  const t = translations[lang];

  return (
    <form {...props} onSubmit={handleSubmit(onSubmit)} data-status={status} data-variant={variant} data-step={hasMultiStep(variant) ? step : undefined}>
      {variant === 'form-with-list' && (
        <>
          <Input
            label='Email'
            register={register('email', {
              required: { value: true, message: t.emailRequired },
              pattern: { value: REGEX.email, message: t.emailInvalid },
            })}
            errors={errors}
            type='email'
          />
          <Input
            label={t.messageLabel}
            register={register('message', {
              required: { value: true, message: t.messageRequired },
            })}
            isTextarea={true}
            errors={errors}
            placeholder={t.messagePlaceholder}
          />
          <Checkbox
            register={register('legal', {
              required: { value: true, message: t.legalRequired },
            })}
            errors={errors}
          >
            {t.legal}
          </Checkbox>
        </>
      )}
      {variant === 'form-with-person' && (
        <>
          <Input
            label={t.messageLabel}
            register={register('message', {
              required: { value: true, message: t.messageRequired },
            })}
            isTextarea={true}
            errors={errors}
            placeholder={t.messagePlaceholder}
          />
          <Input
            label='Email'
            register={register('email', {
              required: { value: true, message: t.emailRequired },
              pattern: { value: REGEX.email, message: t.emailInvalid },
            })}
            errors={errors}
            type='email'
          />
          <Checkbox
            register={register('legal', {
              required: { value: true, message: t.legalRequired },
            })}
            errors={errors}
          >
            {t.legal}
          </Checkbox>
        </>
      )}
      {variant === 'form-lead' && (
        <>
          <Input
            label={t.phoneLabel}
            register={register('phone', {
              required: { value: true, message: t.phoneRequired },
              pattern: { value: REGEX.phone, message: t.phoneInvalid },
            })}
            errors={errors}
            type='tel'
            inputMode='tel'
            autoComplete='tel'
            placeholder={t.phonePlaceholder}
          />
          <Select
            label={dropdownLabel || ''}
            placeholder={dropdownPlaceholder}
            options={dropdownOptions || []}
            register={register('dropdown', {
              required: { value: true, message: t.dropdownRequired },
            })}
            errors={errors}
          />
          <Input
            label='Email'
            register={register('email', {
              required: { value: true, message: t.emailRequired },
              pattern: { value: REGEX.email, message: t.emailInvalid },
            })}
            errors={errors}
            type='email'
            inputMode='email'
            autoComplete='email'
          />
          <Checkbox
            register={register('legal', {
              required: { value: true, message: t.legalRequired },
            })}
            errors={errors}
          >
            {t.legal}
          </Checkbox>
        </>
      )}
      {variant === 'form-influencer' && (
        <>
          <Input
            label={t.nameLabel}
            register={register('fullName', {
              required: { value: true, message: t.nameRequired },
            })}
            errors={errors}
            autoComplete='name'
          />
          <Input
            label='Email'
            register={register('email', {
              required: { value: true, message: t.emailRequired },
              pattern: { value: REGEX.email, message: t.emailInvalid },
            })}
            errors={errors}
            type='email'
            inputMode='email'
            autoComplete='email'
          />
          <Input
            label={t.totalFollowersLabel}
            register={register('totalFollowers', {
              required: { value: true, message: t.totalFollowersRequired },
            })}
            errors={errors}
            placeholder={t.totalFollowersPlaceholder}
          />
          <Input
            label={t.socialMediaLinksLabel}
            register={register('socialMediaLinks', {
              required: { value: true, message: t.socialMediaLinksRequired },
            })}
            isTextarea={true}
            errors={errors}
            placeholder={t.socialMediaLinksPlaceholder}
          />
          <Select
            label={t.publishedVideosLabel}
            options={publishedVideosOptions}
            register={register('publishedVideos', {
              required: { value: true, message: t.publishedVideosRequired },
            })}
            errors={errors}
          />
          <Input
            label={t.exampleVideoLabel}
            register={register('exampleVideo')}
            errors={errors}
            type='url'
            placeholder={t.exampleVideoPlaceholder}
          />
          <Checkbox
            register={register('legal', {
              required: { value: true, message: t.legalRequired },
            })}
            errors={errors}
          >
            {t.legal}
          </Checkbox>
        </>
      )}
      {children}
    </form>
  )
}
