import Image from "next/image";
import Link from "next/link";
import {
  PortableText,
  type PortableTextBlock,
  type PortableTextComponents,
} from "next-sanity";
import { urlFor } from "@/sanity/image";
import { pathFor, type LinkableType } from "@/sanity/paths";

const components: PortableTextComponents = {
  types: {
    image: ({ value }) => {
      if (!value?.asset) return null;
      const src = urlFor(value).width(1600).auto("format").url();
      return (
        <figure>
          <Image
            src={src}
            alt={value.alt ?? ""}
            width={1600}
            height={900}
            className="h-auto w-full rounded-lg border border-line"
          />
          {value.caption ? <figcaption>{value.caption}</figcaption> : null}
        </figure>
      );
    },
  },
  marks: {
    link: ({ value, children }) => {
      const href = value?.href as string | undefined;
      const external = href?.startsWith("http");
      return (
        <a
          href={href}
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {children}
        </a>
      );
    },
    internalLink: ({ value, children }) => {
      const page = value?.page as { _type: LinkableType; slug?: string } | null | undefined;
      if (!page?.slug) return <>{children}</>;
      return <Link href={pathFor(page._type, page.slug)}>{children}</Link>;
    },
  },
};

export function RichText({ value }: { value?: PortableTextBlock[] }) {
  if (!value?.length) return null;
  return (
    <div className="rich-text">
      <PortableText value={value} components={components} />
    </div>
  );
}
