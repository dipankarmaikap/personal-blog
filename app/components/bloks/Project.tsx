import { storyblokEditable } from "@storyblok/react";
import type { ProjectStoryblok } from "~/types";
import { MDRenderer } from "~/utils";

export const Project = ({blok}: ProjectStoryblok) => {
    const {headline, image, description, url, _uid} = blok;
    console.log("url",url);

  return (
    <article
      className={` bg-dark-50 border border-dark-25  px-5 py-7 rounded-lg shadow-xl duration-500 transition-[box-shadow,transform] hover:shadow-dark-25  relative hover:-translate-y-1`}
      {...storyblokEditable(blok)}
      key={_uid}
      itemScope
      itemType="http://schema.org/BlogPosting"
    >

    <a href={url.cached_url} target="_blank" rel="noopener noreferrer">
        <div >
          {image && (
            <div
              className="flex items-center"
              itemProp="image"
              itemScope
              itemType="http://schema.org/ImageObject"
            >
              <picture>
                <source
                  media="(min-width: 768px)"
                  srcSet={`${image?.filename}/m/400x200/smart/filters:quality(60)/`}
                  itemProp="contentUrl"
                />
                <img
                  src={`${image?.filename}/m/750x400/smart/filters:quality(60)/`}
                  alt={image?.alt}
                  className="rounded-lg"
                  itemProp="url"
                />
              </picture>
              <meta itemProp="description" content={image?.alt} />
            </div>
          )}
          <div>
            <h2 className="font-bold text-2xl mb-2" itemProp="headline">
              {headline}
            </h2>
            <MDRenderer className="list-disc">{description}</MDRenderer>
          </div>
        </div>
      </a>
    </article>
  );
};
