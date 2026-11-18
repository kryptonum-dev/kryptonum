import { useEffect, useRef, useState, type FormEvent } from 'react';
import { useForm, type FieldErrors, type FieldValues } from 'react-hook-form';
import Input from '@repo/ui/Input'
import Choice from '@repo/ui/Choice'
import { REGEX, DOMAIN } from '@repo/shared/constants';
import { type Language } from '@repo/shared/languages';
import { sendContactEmail } from '@apps/www/pages/api/contact/sendContactEmail';
import { buildProfileLink } from '@repo/utils/profile-link';
import { suggestEmailFix } from '@repo/utils/email-typo';
import {
  IT_BUDGETS,
  IT_GOALS,
  RT_FOLLOWERS,
  RT_NO_PRODUCT,
  RT_NO_SALES,
  RT_PLATFORMS,
  RT_PRODUCTS,
  RT_SALES,
  firesLeadEvent,
  isTestLead,
  routeItLead,
  routeRtLead,
} from '@repo/utils/lead-routing';
import { trackEvent, updateAnalyticsUser } from '../../../analytics';
import { getUtmForSheet } from '../../../analytics/utm-storage';
import { getMetaIdsForSheet, shouldTrackAnalytics } from './helpers';

/**
 * The campaign lead forms: creators (Richer Together) and companies (IT).
 *
 * Questions answered with one tap come first, the contact details last, so
 * the first screen costs nothing to start. Which mail the person gets and
 * whether Meta hears about a lead is decided by `lead-routing`, the same
 * functions the API uses.
 */
export type LeadVariant = 'form-creator' | 'form-site';

type Props = {
  children: React.ReactNode
  variant: LeadVariant
  lang: Language
  formId?: string
} & React.FormHTMLAttributes<HTMLFormElement>

type Kind = 'rt' | 'it';

const STEP_FIELDS: Record<Kind, string[][]> = {
  rt: [['productType', 'salesRange'], ['platform', 'profile', 'totalFollowers'], ['firstName', 'email', 'phone']],
  it: [['siteGoal', 'budget'], ['firstName', 'email', 'phone']],
};

const translations = {
  pl: {
    stepsLabel: 'Kroki formularza',
    rtSteps: ['Sprzedaż', 'Profil', 'Kontakt'],
    itSteps: ['Strona', 'Kontakt'],
    pickOne: 'Wybierz odpowiedź',
    productLabel: 'Co dziś sprzedajesz?',
    productHint: 'Możesz zaznaczyć kilka.',
    salesLabel: 'Ile sprzedajesz miesięcznie?',
    salesHint: 'Wystarczy w przybliżeniu.',
    platformLabel: 'Gdzie masz najwięcej obserwujących?',
    profileLabel: 'Nazwa profilu albo link',
    profilePlaceholder: 'np. twojprofil',
    siteLabel: 'Adres strony albo profilu',
    sitePlaceholder: 'np. twojastrona.pl',
    profileRequired: 'Wpisz nazwę albo link',
    profileInvalid: 'Sprawdź nazwę albo link',
    followersLabel: 'Ile masz tam obserwujących?',
    goalLabel: 'Co ma robić Twoja strona?',
    budgetLabel: 'Jaki masz budżet?',
    budgetHint: 'Wystarczy rząd wielkości.',
    firstNameLabel: 'Imię',
    firstNameRequired: 'Podaj imię',
    emailLabel: 'E-mail',
    emailRequired: 'Podaj e-mail',
    emailInvalid: 'Sprawdź adres',
    emailFix: 'Chodziło Ci o',
    phoneLabel: 'Telefon (opcjonalnie)',
    phoneInvalid: 'Sprawdź numer',
    rtPhoneHint: 'Zostaw numer, jeśli wolisz krótki telefon zamiast maili. Zagraniczny zacznij od +.',
    itPhoneHint: 'Zostaw numer, a Michał zadzwoni zamiast pisać.',
  },
  en: {
    stepsLabel: 'Form steps',
    rtSteps: ['Sales', 'Profile', 'Contact'],
    itSteps: ['Website', 'Contact'],
    pickOne: 'Pick an answer',
    productLabel: 'What do you sell today?',
    productHint: 'You can pick several.',
    salesLabel: 'How much do you sell a month?',
    salesHint: 'A rough figure is enough.',
    platformLabel: 'Where do you have the most followers?',
    profileLabel: 'Profile name or link',
    profilePlaceholder: 'e.g. yourprofile',
    siteLabel: 'Website or profile address',
    sitePlaceholder: 'e.g. yoursite.com',
    profileRequired: 'Enter a name or link',
    profileInvalid: 'Check the name or link',
    followersLabel: 'How many followers do you have there?',
    goalLabel: 'What should your website do?',
    budgetLabel: 'What is your budget?',
    budgetHint: 'A rough figure is enough.',
    firstNameLabel: 'First name',
    firstNameRequired: 'Enter your name',
    emailLabel: 'Email',
    emailRequired: 'Enter your email',
    emailInvalid: 'Check the address',
    emailFix: 'Did you mean',
    phoneLabel: 'Phone (optional)',
    phoneInvalid: 'Check the number',
    rtPhoneHint: 'Leave a number if you prefer a short call to emails. Start a foreign one with +.',
    itPhoneHint: 'Leave a number and Michał will call instead of writing.',
  },
};

const asList = (value: unknown): string[] => [value].flat().filter((item): item is string => typeof item === 'string' && !!item);
const trimmed = (value: unknown) => (typeof value === 'string' ? value.trim() : value);

export default function LeadForm({ children, variant, lang, formId, ...props }: Props) {
  const kind: Kind = variant === 'form-site' ? 'it' : 'rt';
  const steps = STEP_FIELDS[kind];
  const total = steps.length;
  const t = translations[lang] || translations.pl;
  const formName = `contact_form_${variant}`;

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error' | 'rejected'>('idle');
  const [step, setStep] = useState(1);
  const stepRef = useRef(step);
  stepRef.current = step;
  const formRef = useRef<HTMLFormElement>(null);
  const formStarted = useRef(false);
  const leadSaved = useRef(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    trigger,
    watch,
    getValues,
    setValue,
  } = useForm({ mode: 'onTouched', defaultValues: { platform: RT_PLATFORMS[0] } as FieldValues });

  const track = (eventName: 'form_start' | 'form_step_2' | 'form_step_3') => {
    if (!shouldTrackAnalytics()) return;
    trackEvent({
      meta: { eventName, params: { form_name: formName } },
      ga4: { eventName, params: { form_name: formName } },
    });
  };

  const handleFormStart = () => {
    if (formStarted.current) return;
    formStarted.current = true;
    track('form_start');
  };

  const goTo = (target: number) => {
    setStep(target);
    requestAnimationFrame(() => {
      const form = formRef.current;
      if (!form) return;
      // A shorter step can leave the form above the screen: bring its top back.
      const top = form.getBoundingClientRect().top;
      if (top < 72) window.scrollBy({ top: top - 96, behavior: 'smooth' });
      form.querySelector<HTMLElement>(`[data-lead-step="${target}"] input`)?.focus({ preventScroll: true });
    });
  };

  const next = async () => {
    const current = stepRef.current;
    if (current >= total) return;
    if (!(await trigger(steps[current - 1]))) return;
    goTo(current + 1);
    track(current + 1 === 2 ? 'form_step_2' : 'form_step_3');
  };

  useEffect(() => {
    const tryAgain = () => setStatus('idle');
    const nextStep = () => { void next(); };
    const prevStep = () => { if (stepRef.current > 1) goTo(stepRef.current - 1); };
    document.addEventListener('Contact-TryAgain', tryAgain);
    document.addEventListener('Contact-NextStep', nextStep);
    document.addEventListener('Contact-PrevStep', prevStep);
    return () => {
      document.removeEventListener('Contact-TryAgain', tryAgain);
      document.removeEventListener('Contact-NextStep', nextStep);
      document.removeEventListener('Contact-PrevStep', prevStep);
    };
  }, []);

  const products = asList(watch('productType'));
  const sellsNothing = products.includes(RT_NO_PRODUCT);
  const platform = (watch('platform') as string) || RT_PLATFORMS[0];
  const isOwnSite = platform === RT_PLATFORMS[RT_PLATFORMS.length - 1];
  const emailFix = suggestEmailFix(watch('email') as string);

  // An error shown after "Dalej" should go away with the tap that fixes it.
  const revalidate = (name: string) => { if (errors[name]) void trigger(name); };

  const onValid = async (data: FieldValues) => {
    const email = data.email as string;
    const phone = (data.phone as string) || undefined;
    const firstName = data.firstName as string;

    const details = kind === 'rt'
      ? {
        productType: asList(data.productType),
        salesRange: asList(data.productType).includes(RT_NO_PRODUCT) ? RT_NO_SALES : (data.salesRange as string),
        totalFollowers: data.totalFollowers as string,
        socialMediaLinks: buildProfileLink(data.platform as string, data.profile as string) || '',
      }
      : {
        siteGoal: data.siteGoal as string,
        budget: data.budget as string,
      };
    const route = kind === 'rt' ? routeRtLead(details) : routeItLead({ ...details, phone });
    const lead = { formKind: kind, formId, firstName, email, phone, ...details };

    setStatus('loading');

    if (!leadSaved.current) {
      const saveLead = () => fetch(`${DOMAIN}/api/s3d`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...lead,
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

    const response = await sendContactEmail({ ...lead, legal: true });
    if (!response.success) {
      setStatus('error');
      if (typeof fathom !== 'undefined') fathom.trackEvent('contactForm_error');
      return;
    }

    const isWanted = firesLeadEvent(route);
    setStatus(isWanted ? 'success' : 'rejected');
    reset();
    setStep(1);
    leadSaved.current = false;
    if (typeof fathom !== 'undefined') fathom.trackEvent('contactForm_submit');
    // Test submissions (+test address) must not teach Meta what a lead looks like.
    if (!shouldTrackAnalytics() || isTestLead(email)) return;
    updateAnalyticsUser({ email, phone: phone || '' });
    trackEvent({
      user: { email, phone: phone || '' },
      meta: {
        eventName: isWanted ? 'Lead' : 'ApplicationBelowThreshold',
        contentName: 'contact_form',
        params: { form_name: formName },
      },
      ga4: {
        eventName: isWanted ? 'generate_lead' : 'form_submit',
        params: { form_name: formName },
      },
    });
  };

  // Every step is checked before moving on, so this only fires when a field
  // on an earlier step was changed back to something invalid.
  const onInvalid = (invalid: FieldErrors) => {
    const index = steps.findIndex((fields) => fields.some((name) => invalid[name]));
    if (index !== -1 && index + 1 !== stepRef.current) goTo(index + 1);
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    // Enter in a field on an earlier step means "next", not "send".
    if (stepRef.current < total) {
      event.preventDefault();
      void next();
      return;
    }
    void handleSubmit(onValid, onInvalid)(event);
  };

  const stepNames = kind === 'rt' ? t.rtSteps : t.itSteps;
  const contactStep = total;

  return (
    <form
      {...props}
      ref={formRef}
      noValidate
      onSubmit={onSubmit}
      onFocus={handleFormStart}
      onChange={handleFormStart}
      data-status={status}
      data-variant={variant}
      data-step={step}
      data-last-step={step === total}
    >
      <ol className="form-steps" aria-label={t.stepsLabel} style={{ gridTemplateColumns: `repeat(${total}, 1fr)` }}>
        {stepNames.map((name, i) => {
          const n = i + 1;
          const state = n < step ? 'done' : n === step ? 'active' : 'todo';
          return (
            <li key={name} data-state={state} aria-current={state === 'active' ? 'step' : undefined}>
              <span className="index">{String(n).padStart(2, '0')}</span>
              <span className="name">{name}</span>
            </li>
          );
        })}
      </ol>

      {kind === 'rt' && (
        <>
          <div className="lead-step" data-lead-step={1} hidden={step !== 1}>
            <Choice
              label={t.productLabel}
              hint={t.productHint}
              options={RT_PRODUCTS}
              multiple
              register={register('productType', { required: { value: true, message: t.pickOne } })}
              errors={errors}
              onPick={(value, checked) => {
                const current = asList(getValues('productType'));
                if (checked && value === RT_NO_PRODUCT) {
                  setValue('productType', [RT_NO_PRODUCT]);
                } else if (checked && current.includes(RT_NO_PRODUCT)) {
                  setValue('productType', current.filter((item) => item !== RT_NO_PRODUCT));
                }
                revalidate('productType');
                revalidate('salesRange');
              }}
            />
            <div hidden={sellsNothing}>
              <Choice
                label={t.salesLabel}
                hint={t.salesHint}
                options={RT_SALES}
                register={register('salesRange', {
                  validate: (value) => asList(getValues('productType')).includes(RT_NO_PRODUCT) || !!value || t.pickOne,
                })}
                errors={errors}
                onPick={() => revalidate('salesRange')}
              />
            </div>
          </div>
          <div className="lead-step" data-lead-step={2} hidden={step !== 2}>
            <Choice
              label={t.platformLabel}
              options={RT_PLATFORMS}
              register={register('platform', { required: { value: true, message: t.pickOne } })}
              errors={errors}
              onPick={() => revalidate('profile')}
            />
            <Input
              label={isOwnSite ? t.siteLabel : t.profileLabel}
              register={register('profile', {
                setValueAs: trimmed,
                required: { value: true, message: t.profileRequired },
                validate: (value: string) => !!buildProfileLink(getValues('platform') as string, value) || t.profileInvalid,
              })}
              errors={errors}
              placeholder={isOwnSite ? t.sitePlaceholder : t.profilePlaceholder}
              autoCapitalize='none'
              autoCorrect='off'
              autoComplete='off'
              spellCheck={false}
            />
            <Choice
              label={t.followersLabel}
              options={RT_FOLLOWERS}
              register={register('totalFollowers', { required: { value: true, message: t.pickOne } })}
              errors={errors}
              onPick={() => revalidate('totalFollowers')}
            />
          </div>
        </>
      )}

      {kind === 'it' && (
        <div className="lead-step" data-lead-step={1} hidden={step !== 1}>
          <Choice
            label={t.goalLabel}
            options={IT_GOALS}
            register={register('siteGoal', { required: { value: true, message: t.pickOne } })}
            errors={errors}
            onPick={() => revalidate('siteGoal')}
          />
          <Choice
            label={t.budgetLabel}
            hint={t.budgetHint}
            options={IT_BUDGETS}
            register={register('budget', { required: { value: true, message: t.pickOne } })}
            errors={errors}
            onPick={() => revalidate('budget')}
          />
        </div>
      )}

      <div className="lead-step" data-lead-step={contactStep} hidden={step !== contactStep}>
        <Input
          label={t.firstNameLabel}
          register={register('firstName', {
            setValueAs: trimmed,
            required: { value: true, message: t.firstNameRequired },
          })}
          errors={errors}
          autoComplete='given-name'
          autoCapitalize='words'
        />
        <div className="lead-field">
          <Input
            label={t.emailLabel}
            register={register('email', {
              setValueAs: trimmed,
              required: { value: true, message: t.emailRequired },
              pattern: { value: REGEX.email, message: t.emailInvalid },
            })}
            errors={errors}
            type='email'
            inputMode='email'
            autoComplete='email'
            autoCapitalize='none'
            autoCorrect='off'
            spellCheck={false}
          />
          {emailFix && (
            <p className="lead-hint">
              {t.emailFix}{' '}
              <button type="button" className="link" onClick={() => setValue('email', emailFix, { shouldValidate: true })}>{emailFix}</button>?
            </p>
          )}
        </div>
        <div className="lead-field">
          <Input
            label={t.phoneLabel}
            register={register('phone', {
              setValueAs: trimmed,
              pattern: { value: REGEX.phone, message: t.phoneInvalid },
            })}
            errors={errors}
            type='tel'
            inputMode='tel'
            autoComplete='tel'
          />
          <p className="lead-hint">{kind === 'rt' ? t.rtPhoneHint : t.itPhoneHint}</p>
        </div>
      </div>
      {children}
    </form>
  )
}
