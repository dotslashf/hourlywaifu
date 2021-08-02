export interface TwitterTweetResponse {
  id: number;
  id_str: string;
}

export interface TwitterMediaResponse {
  media_id: number;
  media_id_string: string;
  size: number;
  expires_after_secs: number;
  image: { image_type: string; w: number; h: number };
}
