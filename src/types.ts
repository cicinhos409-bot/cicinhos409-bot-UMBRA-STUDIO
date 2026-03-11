export interface Project {
  id: string;
  name: string;
  script: string;
  aspect_ratio: string;
  style: string;
  created_at: string;
  scenes?: Scene[];
  characters?: Character[];
  environments?: Environment[];
}

export interface Scene {
  id: string;
  project_id: string;
  content: string;
  image_url?: string;
  video_url?: string;
  audio_url?: string;
  order_index: number;
  visualDescription?: string;
}

export interface Character {
  id: string;
  project_id: string;
  name: string;
  description: string;
  image_url?: string;
}

export interface Environment {
  id: string;
  project_id: string;
  name: string;
  description: string;
}
