import {BannerResponse} from './banner.response';
import {BusinessNumberResponse} from './business-number.response';
import {SocialNetworkResponse} from './social-network.response';

export interface CatalogResponse {
  accountId: string;
  bannerList: BannerResponse [];
  businessName: string;
  businessNumber: BusinessNumberResponse;
  categories: string [];
  description: string;
  id: string;
  logoUrl: string;
  slug: string;
  socialNetworks: SocialNetworkResponse [];
  styles: Object;
}
