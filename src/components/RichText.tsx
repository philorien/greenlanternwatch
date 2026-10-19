import Image from "next/image";
import Link from "next/link";
import {
  PortableText,
  type PortableTextBlock,
  type PortableTextComponents,
} from "next-sanity";
import { externalRel } from "@/lib/affiliate";
import { imageSize, screenFitWidth, urlFor } from "@/sanity/image";
import { pathFor, type LinkableType } from "@/sanity/paths";

const components: PortableTextComponents = {
  types: {
    image: ({ value }) => {
      if (!value?.asset) return null;
      const src = urlFor(value).width(1600).auto("format").url();
      const size = imageSize(value) ?? { width: 1600, height: 900 };
      return (
        <figure>
          <Image
            src={src}
            alt={value.alt ?? ""}
            width={size.width}
            height={size.height}
            sizes="(min-width: 768px) 768px, 100vw"
            className="mx-auto h-auto rounded-lg border border-line"
            style={{ width: screenFitWidth(size) }}
          />
          {value.caption ? <figcaption>{value.caption}</figcaption> : null}
        </figure>
      );
    },
  },
  marks: {
    link: ({ value, children }) => {
      const href = value?.href as string | undefined;
      return (
        <a
          href={href}
          {...(href?.startsWith("http") ? { target: "_blank", rel: externalRel(href) } : {})}
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
