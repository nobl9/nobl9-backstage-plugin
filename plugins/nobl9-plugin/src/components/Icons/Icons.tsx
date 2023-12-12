import React from 'react';
import { SvgIcon, SvgIconProps } from '@material-ui/core';

export const SloIcon = (props: SvgIconProps) => (
  <SvgIcon {...props} viewBox="0 0 24 24">
    <path
      fill="currentColor"
      width="1em"
      height="1em"
      display="inline-block"
      d="M12 7.716a4.283 4.283 0 1 0 4.281 4.285 4.24 4.24 0 0 0-.172-1.14l-4.009 1.27 1.479-4.105A4.258 4.258 0 0 0 12 7.716Z"
    />
    <path d="M23.694 9.324c-.063-.273-.145-.536-.225-.8l-2.54.805c.059.195.121.388.167.588a9.335 9.335 0 1 1-5.8-6.648l.9-2.507a11.994 11.994 0 1 0 7.5 8.561Z" />
    <path d="m23.993 6.273-4.671-1.077-.853-4.7-4.1 9.426Z" />
  </SvgIcon>
);

export const CompositeIcon = (props: SvgIconProps) => (
  <SvgIcon {...props} viewBox="0 0 24 24">
    <circle cx="13.996" cy="13.499" r="13" fill="#0081BA" />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M17.49 3.065A11 11 0 0 0 6.222 5.72c-4.296 4.296-4.296 11.26 0 15.556 4.296 4.296 11.26 4.296 15.556 0a10.996 10.996 0 0 0 2.848-10.628l-1.99.543a8.938 8.938 0 1 1-5.799-6.17l.653-1.957ZM16.278 6.7a7.168 7.168 0 1 0 4.651 4.957l-1.99.543a5.106 5.106 0 1 1-3.313-3.543l.652-1.957Zm-1.345 4.034a2.917 2.917 0 1 0 1.893 2.042l-1.99.543a.854.854 0 1 1-.555-.628l.652-1.957Z"
      fill="#fff"
    />
  </SvgIcon>
);
