import * as React from "react";
import { Container, Font, Head, Hr, Html, Preview, Text, Body, Link, Img, Heading, Section, Row, Column } from "@react-email/components";
import { Resend } from 'resend';
import { render } from '@react-email/render';

type Props = {
  lang: 'pl' | 'en';
  products: {
    name: string;
    link: string;
  }[];
}

const PurchaseAccess = ({ lang, products }: Props) => {
  return (
    <Html lang={lang}>
      <Head>
        <Font
          fontFamily="Poppins"
          fallbackFontFamily={['Helvetica', 'Arial', 'sans-serif']}
          fontWeight={400}
          fontStyle="normal"
          webFont={{
            url: 'https://fonts.gstatic.com/s/poppins/v23/pxiEyp8kv8JHgFVrJJfecnFHGPc.woff2',
            format: 'woff2',
          }}
        />
        <style>{`
          * {
            font-family: "Poppins" , "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "Oxygen-Sans", "Ubuntu", "Cantarell", "Helvetica Neue", "sans-serif"
          }
        `}</style>
      </Head>
      <Preview>{
        lang === 'pl'
          ? 'Dziękujemy za zakup. Oto Twój dostęp do produktów.'
          : 'Thank you for your purchase. Here is your access to the products.'
      }</Preview>
      <Body style={body}>
        <Container style={container}>
          <Img
            src={'https://email.kryptonum.eu/kryptonum-logo.png'}
            width="112"
            height="24.06"
            alt="Kryptonum"
            style={{
              display: 'inline-block',
              marginBottom: '24px',
            }}
          />
          <Heading style={h1}>{lang === 'pl'
            ? 'Dostęp do produktów'
            : 'Access to products'}</Heading>
          <Text style={{ ...text }}>{lang === 'pl'
            ? 'Dziękujemy za zakup. Poniżej znajdziesz dostępy do Twoich produktów.'
            : 'Thank you for your purchase. Below you will find access to your products.'}</Text>
          <Section>
            <Row style={{ marginTop: '32px', marginBottom: '16px' }}>
              <Column>
                <Text style={{ fontSize: '14px', color: '#c6cdc4', margin: 0 }}>
                  {lang === 'pl'
                    ? 'Produkt'
                    : 'Product'}
                </Text>
              </Column>
            </Row>
            {products.map(({ name, link }, index) => (
              <Row style={{ marginTop: '16px' }} key={index}>
                <Column>
                  <Text style={{ fontSize: '14px', margin: 0, paddingRight: '12px' }}>
                    {name}
                  </Text>
                </Column>
                <Column style={{ textAlign: 'right' }}>
                  <Link href={link}
                    style={{
                      display: 'inline-block',
                      border: '1px solid #2dd282',
                      borderRadius: '12px',
                      padding: '8px 16px',
                      color: '#2dd282',
                      fontSize: '13px',
                      textDecoration: 'none',
                      width: '76px',
                      textAlign: 'center'
                    }}>
                    {lang === 'pl'
                      ? 'Pobierz'
                      : 'Download'}
                  </Link>
                </Column>
              </Row>
            ))}
          </Section>
          <Hr style={{
            margin: '48px 0',
            borderColor: '#2dd28222',
          }} />
          <Text
            style={{
              ...text,
              fontSize: '12px',
            }}
          >
            {lang === 'pl'
              ? 'Otrzymałeś ten email, ponieważ zakupiłeś produkt w sklepie Kryptonum.'
              : 'You received this email because you purchased a product in the Kryptonum store.'}
          </Text>
        </Container>
      </Body>
    </Html>
  );
}


const body = {
  backgroundColor: '#000103',
  color: '#f0f7f7',
  WebkitFontSmoothing: 'antialiased',
  fontSize: '14px',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif'
};

const container = {
  paddingLeft: '16px',
  paddingRight: '16px',
  paddingTop: '48px',
  paddingBottom: '48px',
  margin: '0 auto',
};

const h1 = {
  color: '#f0f7f7',
  fontSize: '32px',
  fontWeight: 400,
  lineHeight: '1.4',
  letterSpacing: '-0.024em',
  margin: '16px 0',
  padding: '0',
};

const text = {
  color: '#f0f7f7',
  margin: '12px 0',
  fontSize: '16px',
  lineHeight: '1.75',
};

const resend = new Resend(process.env.RESEND_API_KEY!);

type SendPurchaseAccessEmailProps = {
  to: string;
} & Props

export async function sendPurchaseAccessEmail({ to, lang, products }: SendPurchaseAccessEmailProps) {
  const template = PurchaseAccess({ lang, products });
  const subject = lang === 'pl'
    ? 'Dostęp do zakupionych produktów - Kryptonum'
    : 'Access to purchased products - Kryptonum';

  try {
    const { data, error } = await resend.emails.send({
      from: 'Kryptonum <learn@send.kryptonum.eu>',
      to,
      subject,
      react: template,
      text: await render(template, { plainText: true }),
    });

    if (error) {
      console.error('Error sending email:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
}
