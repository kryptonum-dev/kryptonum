export type AnalyticsUser = {
  email?: string
  phone?: string
  first_name?: string
  last_name?: string
  external_id?: string
  postal_code?: string
  city?: string
  country_code?: string
}

export type MetaEventName =
  | 'PageView'
  | 'ViewContent'
  | 'ViewCategory'
  | 'Search'
  | 'AddToCart'
  | 'RemoveFromCart'
  | 'InitiateCheckout'
  | 'AddPaymentInfo'
  | 'Purchase'
  | 'Lead'
  | 'Contact'
  | 'ViewCart'
  | 'CompleteRegistration'
  | 'Schedule'
  | 'PageScroll'
  | 'TimeOnPage'
  | 'Form'
  | 'Login'
  | 'Logout'
  | 'Download'

export type MetaEventParamsMap = {
  PageView: {
    page_path?: string
    page_title?: string
  }
  ViewContent: {
    content_ids?: string[]
    content_type?: string
    content_category?: string
    value?: number
    currency?: string
  }
  ViewCategory: {
    category_id?: string
    category_name?: string
    value?: number
    currency?: string
    content_ids?: string[]
  }
  Search: {
    search_string?: string
  }
  AddToCart: {
    content_ids?: string[]
    content_type?: string
    value?: number
    currency?: string
    quantity?: number
  }
  RemoveFromCart: {
    content_ids?: string[]
    content_type?: string
    value?: number
    currency?: string
    quantity?: number
  }
  InitiateCheckout: {
    value?: number
    currency?: string
    content_ids?: string[]
  }
  AddPaymentInfo: {
    payment_type?: string
    value?: number
    currency?: string
  }
  Purchase: {
    value?: number
    currency?: string
    order_id?: string
  }
  Lead: {
    form_name?: string
    content_name?: string
    value?: number
    currency?: string
  }
  Contact: {
    contact_type?: string
    contact_value?: string
  }
  ViewCart: {
    value?: number
    currency?: string
    content_ids?: string[]
  }
  CompleteRegistration: Record<string, never>
  Schedule: {
    content_name?: string
    content_category?: string
    value?: number
    currency?: string
  }
  PageScroll: {
    percent_scrolled?: number
  }
  TimeOnPage: {
    seconds?: number
  }
  Form: {
    form_name?: string
    success?: boolean
  }
  Login: Record<string, never>
  Logout: Record<string, never>
  Download: {
    file_name?: string
    file_type?: string
  }
}

export type Ga4EventName =
  | 'page_view'
  | 'view_item'
  | 'view_item_list'
  | 'search'
  | 'add_to_cart'
  | 'remove_from_cart'
  | 'begin_checkout'
  | 'add_payment_info'
  | 'purchase'
  | 'sign_up'
  | 'generate_lead'
  | 'form_submit'
  | 'login'
  | 'logout'
  | 'scroll'
  | 'engagement_time'
  | 'file_download'
  | 'lead'
  | 'contact'
  | 'view_cart'

export type Ga4EventParamsMap = {
  page_view: {
    page_location?: string
    page_title?: string
    page_path?: string
  }
  view_item: {
    currency?: string
    value?: number
    items?: Array<Record<string, unknown>>
  }
  view_item_list: {
    item_list_id?: string
    item_list_name?: string
    items?: Array<Record<string, unknown>>
  }
  search: {
    search_term?: string
  }
  add_to_cart: {
    currency?: string
    value?: number
    items?: Array<Record<string, unknown>>
  }
  remove_from_cart: {
    currency?: string
    value?: number
    items?: Array<Record<string, unknown>>
  }
  begin_checkout: {
    currency?: string
    value?: number
    items?: Array<Record<string, unknown>>
    coupon?: string
  }
  add_payment_info: {
    currency?: string
    value?: number
    items?: Array<Record<string, unknown>>
    payment_type?: string
  }
  purchase: {
    currency?: string
    transaction_id: string
    value?: number
    tax?: number
    shipping?: number
    coupon?: string
    items?: Array<Record<string, unknown>>
  }
  sign_up: {
    method?: string
  }
  generate_lead: {
    form_name?: string
    value?: number
  }
  form_submit: {
    form_name?: string
  }
  login: {
    method?: string
  }
  logout: {
    method?: string
  }
  scroll: {
    percent_scrolled?: number
  }
  engagement_time: {
    seconds?: number
  }
  file_download: {
    file_name?: string
    file_extension?: string
  }
  lead: {
    form_name?: string
    value?: number
  }
  contact: {
    contact_type?: string
    contact_value?: string
  }
  view_cart: {
    currency?: string
    value?: number
    items?: Array<Record<string, unknown>>
  }
}

export type TrackEventMeta<T extends MetaEventName = MetaEventName> = {
  eventName: T
  params?: MetaEventParamsMap[T]
  contentName?: string
}

export type TrackEventGa4<T extends Ga4EventName = Ga4EventName> = {
  eventName: T
  params?: Ga4EventParamsMap[T]
}

export type TrackEventParams<
  TMeta extends MetaEventName = MetaEventName,
  TGa4 extends Ga4EventName = Ga4EventName
> = {
  eventId?: string
  url?: string
  user?: AnalyticsUser
  meta?: TrackEventMeta<TMeta>
  ga4?: TrackEventGa4<TGa4>
}

export type ConsentModeState = {
  functionality_storage: 'granted' | 'denied'
  security_storage: 'granted' | 'denied'
  ad_storage: 'granted' | 'denied'
  ad_user_data: 'granted' | 'denied'
  ad_personalization: 'granted' | 'denied'
  analytics_storage: 'granted' | 'denied'
  personalization_storage: 'granted' | 'denied'
  conversion_api: 'granted' | 'denied'
  advanced_matching: 'granted' | 'denied'
}

export type ConsentSelections = {
  necessary: boolean
  analytics: boolean
  preferences: boolean
  marketing: boolean
  conversion_api: boolean
  advanced_matching: boolean
}

declare global {
  interface Window {
    dataLayer: unknown[]
    gtag: (...args: unknown[]) => void
    fbq: ((...args: unknown[]) => void) & {
      loaded?: boolean
      queue?: unknown[][]
      callMethod?: (...args: unknown[]) => void
      version?: string
      push?: (...args: unknown[]) => void
      instance?: {
        pixelsByID?: Record<string, {
          userData?: Record<string, unknown>
          userDataFormFields?: Record<string, unknown>
        } | undefined>
      }
    }
    _fbq?: Window['fbq']
    __analyticsReady?: boolean
    __metaPixelId?: string | null
    __metaPixelAdvancedMatching?: boolean
    __pageViewTracked?: boolean
    trackEvent: <
      TMeta extends MetaEventName = MetaEventName,
      TGa4 extends Ga4EventName = Ga4EventName
    >(params: TrackEventParams<TMeta, TGa4>) => string
  }
}
