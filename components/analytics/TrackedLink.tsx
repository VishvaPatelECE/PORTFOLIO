"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import {
  trackPortfolioEvent,
  type PortfolioEventMap,
  type PortfolioEventName,
} from "@/lib/analytics/ga4";

type TrackedLinkProps<K extends PortfolioEventName> = Omit<ComponentProps<typeof Link>, "onClick"> & {
  eventName: K;
  eventParams: PortfolioEventMap[K];
  onClick?: ComponentProps<typeof Link>["onClick"];
};

export function TrackedLink<K extends PortfolioEventName>({
  eventName,
  eventParams,
  onClick,
  ...props
}: TrackedLinkProps<K>) {
  return (
    <Link
      {...props}
      onClick={(e) => {
        trackPortfolioEvent(eventName, eventParams);
        onClick?.(e);
      }}
    />
  );
}

type TrackedAnchorProps<K extends PortfolioEventName> = Omit<ComponentProps<"a">, "onClick"> & {
  eventName: K;
  eventParams: PortfolioEventMap[K];
  onClick?: ComponentProps<"a">["onClick"];
};

export function TrackedAnchor<K extends PortfolioEventName>({
  eventName,
  eventParams,
  onClick,
  ...props
}: TrackedAnchorProps<K>) {
  return (
    <a
      {...props}
      onClick={(e) => {
        trackPortfolioEvent(eventName, eventParams);
        onClick?.(e);
      }}
    />
  );
}

