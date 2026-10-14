import Image from "next/image";
import {
  PortableText,
  type PortableTextBlock,
  type PortableTextComponents,
} from "next-sanity";
import { urlFor } from "@/sanity/image";

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
