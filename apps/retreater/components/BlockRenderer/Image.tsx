import NextImage, { ImageProps } from 'next/image';
import * as z from 'zod';

import { Link } from '../Link';
import { BlockComponent } from './types';
import { NonEmptyString, StyledBlockAttributes, getStyleFromAttributes, useBlockAttributes } from './utils';

let NonZeroInt = z
  .number()
  .int()
  .transform((x) => (x === 0 ? undefined : x));

const ImageAttributes = StyledBlockAttributes.extend({
  alt: NonEmptyString.optional(),
  caption: NonEmptyString.optional(),
  id: NonZeroInt,
  height: NonZeroInt,
  width: NonZeroInt,
  href: NonEmptyString.optional(),
  linkClass: NonEmptyString.optional(),
  linkDestination: z.enum(['none', 'custom', 'attachment', 'media']),
  linkTarget: NonEmptyString.optional(),
  rel: NonEmptyString.optional(),
  sizeSlug: z.string().optional(),
  title: NonEmptyString.optional(),
  url: z.string(),
});

export const Image: BlockComponent = ({ block }) => {
  let attributes = useBlockAttributes(block, ImageAttributes);
  let style = getStyleFromAttributes(attributes);
  let dimensions = getDimensions(attributes);

  let image = <NextImage src={attributes.url} alt={attributes.alt} {...dimensions} />;
  if (attributes.href != null) {
    switch (attributes.linkDestination) {
      case 'attachment': {
        let u = new URL(attributes.href);
        image = <Link href={u.pathname}>{image}</Link>;
        break;
      }

      case 'media':
      case 'custom':
        image = (
          <Link href={attributes.href} ref={attributes.rel} target={attributes.linkTarget}>
            {image}
          </Link>
        );
        break;
    }
  }

  return (
    <figure id={attributes.anchor} style={style}>
      {image}
      {attributes.caption != null ? <figcaption>{attributes.caption}</figcaption> : null}
    </figure>
  );
};

function getDimensions({
  width,
  height,
  url,
}: z.infer<typeof ImageAttributes>): Pick<ImageProps, 'height' | 'width' | 'layout'> {
  if (typeof width === 'number' && typeof height === 'number') return { width, height };

  let u = new URL(url);
  let re = /(?<width>\d+)x(?<height>\d+)\.\w{3,4}$/g;
  let match = re.exec(u.pathname);

  if (match != null) {
    let w = Number(match.groups?.width);
    let h = Number(match.groups?.height);
    if (!Number.isNaN(w) && !Number.isNaN(h)) return { width: w, height: h };
  }

  return { layout: 'fill' };
}
