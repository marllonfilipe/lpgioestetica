import type { MetadataRoute } from "next";
import { siteConfig } from "../src/config/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    ...(siteConfig.canonicalUrl
      ? { sitemap: `${siteConfig.canonicalUrl.replace(/\/$/, "")}/sitemap.xml` }
      : {}),
  };
}
