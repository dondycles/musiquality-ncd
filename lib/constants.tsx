import {
  FaApple,
  FaFacebookSquare,
  FaInstagramSquare,
  FaSpotify,
  FaYoutubeSquare,
} from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
import { z } from "zod";

export const SOCIAL_MEDIA_TYPES = z.enum([
  "facebook",
  "instagram",
  "x",
  "youtube",
  "spotify",
  "apple_music",
]);

export const SOCIAL_MEDIA_BASE_URLS = z.enum([
  "https://open.spotify.com/artist/",
  "https://music.apple.com/us/artist/",
  "https://www.youtube.com/@",
  "https://www.facebook.com/",
  "https://www.instagram.com/",
  "https://www.x.com/",
]);

export const SOCIAL_MEDIAS: {
  name: string;
  type: z.infer<typeof SOCIAL_MEDIA_TYPES>;
  url: z.infer<typeof SOCIAL_MEDIA_BASE_URLS>;
  icon: React.ReactNode;
}[] = [
  {
    name: "Facebook",
    type: "facebook",
    url: "https://www.facebook.com/",
    icon: <FaFacebookSquare className="text-blue-500" />,
  },
  {
    name: "Instagram",
    type: "instagram",
    url: "https://www.instagram.com/",
    icon: <FaInstagramSquare className="text-pink-500" />,
  },
  {
    name: "X",
    type: "x",
    url: "https://www.x.com/",
    icon: <FaSquareXTwitter className="text-foreground" />,
  },
  {
    name: "YouTube",
    type: "youtube",
    url: "https://www.youtube.com/@",
    icon: <FaYoutubeSquare className="text-red-500" />,
  },
  {
    name: "Spotify",
    type: "spotify",
    url: "https://open.spotify.com/artist/",
    icon: <FaSpotify className="text-green-500" />,
  },
  {
    name: "Apple Music",
    type: "apple_music",
    url: "https://music.apple.com/us/artist/",
    icon: <FaApple className="text-gray-500" />,
  },
];
