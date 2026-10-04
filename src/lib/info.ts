import rawSiteInfo from '../../public/0user.json';

export interface ContactLink {
  label: string;
  text: string;
  href: string;
  target?: string;
  rel?: string;
}

export interface HomeInfo {
  bio: string;
  note?: string;
}

export interface SiteMeta {
  name: string;
  url: string;
  title: string;
  description: string;
  locale?: string;
  ogImage?: string;
}

export interface SiteInfo {
  name: string;
  role: string;
  home: HomeInfo;
  site: SiteMeta;
  contacts: ContactLink[];
}

export const info: SiteInfo = rawSiteInfo as SiteInfo;

export const contacts = info.contacts;

export default info;
