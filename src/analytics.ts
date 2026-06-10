type PageViewParams = {
  page_title: string;
  page_location: string;
  page_path: string;
  page_referrer?: string;
};

declare global {
  interface Window {
    gtag?: (command: 'event', eventName: 'page_view', params: PageViewParams) => void;
  }
}

let previousPageLocation = document.referrer;

export function trackPageView(title: string) {
  if (!window.gtag) return;

  const pageLocation = window.location.href;
  const params: PageViewParams = {
    page_title: title,
    page_location: pageLocation,
    page_path: `${window.location.pathname}${window.location.search}${window.location.hash}`,
  };

  if (previousPageLocation) {
    params.page_referrer = previousPageLocation;
  }

  window.gtag('event', 'page_view', params);
  previousPageLocation = pageLocation;
}
