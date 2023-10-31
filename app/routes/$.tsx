import { json } from "@remix-run/node";
import { getStoryblokApi } from "@storyblok/react";
import { useStoryblokData } from "~/hooks";
import type { MetaFunction, LoaderFunctionArgs } from "@remix-run/node";
import { getSeo } from "~/utils";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  let slug = params["*"] ?? "home";

  const sbApi = getStoryblokApi();

  const resolveRelations = ["post.categories"];

  const { data }: { data: any } = await sbApi.get(`cdn/stories/${slug}`, {
    version: "draft",
  });

  if (!data || !data.story) {
    return json({ notFound: true }, { status: 404 });
  }

  const numberOfPosts = data.story.content.body?.find(
    (item: { component: string }) => item.component === "last-posts"
  )?.number_of_posts;

  const { data: lastPosts } = await sbApi.get(`cdn/stories`, {
    version: "draft",
    starts_with: "blog/",
    per_page: numberOfPosts,
    is_startpage: false,
    resolve_relations: resolveRelations,
  });
  const story = data?.story;

  const seo = story?.content?.seo_plugin?.title
    ? story?.content?.seo_plugin
    : story?.content?.seo[0];

  return json({
    story,
    lastPosts: lastPosts.stories,
    seo,
  });
};

export const meta: MetaFunction = ({ data }: { data: any }) => {
  return getSeo(data.seo, data.story?.name);
};

const RootPage = () => {
  const data = useStoryblokData();

  if (data.message === "Not Found") {
    return (
      <div>
        <h1>Page Not Found</h1>
        <p>The page you're looking for doesn't exist.</p>
      </div>
    );
  }

  return data;
};

export default RootPage;
