declare module 'react-scroll' {
  import { Component } from 'react';

  import type { ReactNode } from 'react';

  export interface LinkProps {
    to: string;
    smooth?: boolean | string;
    spy?: boolean;
    duration?: number;
    offset?: number;
    delay?: number;
    isDynamic?: boolean;
    onSetActive?: (to: string) => void;
    onSetInactive?: (to: string) => void;
    onClick?: () => void;
    containerId?: string;
    activeClass?: string;
    spyThrottle?: number;
    hashSpy?: boolean;
    spy?: boolean;
    hash?: boolean;
    saveHashHistory?: boolean;
    className?: string;
    style?: React.CSSProperties;
    children?: ReactNode;
    [key: string]: any;
  }

  export class Link extends Component<LinkProps> {}

  export interface ElementProps {
    name: string;
    id?: string;
    className?: string;
    style?: React.CSSProperties;
    children?: ReactNode;
    [key: string]: any;
  }

  export class Element extends Component<ElementProps> {}

  export interface ScrollElementProps {
    name: string;
    id?: string;
    className?: string;
    style?: React.CSSProperties;
    children?: ReactNode;
    [key: string]: any;
  }

  export class ScrollElement extends Component<ScrollElementProps> {}

  export interface Events {
    scrollStart: () => void;
    scrollEnd: () => void;
    scroll: () => void;
  }

  export interface scrollSpy {
    update(): void;
  }

  export const scrollSpy: scrollSpy;

  export interface scroller {
    scrollTo(
      to: string,
      options?: {
        duration?: number;
        delay?: number;
        smooth?: boolean | string;
        offset?: number;
      }
    ): void;
  }

  export const scroller: scroller;

  export interface animateScroll {
    scrollToTop(options?: {
      duration?: number;
      smooth?: boolean | string;
    }): void;
    scrollToBottom(options?: {
      duration?: number;
      smooth?: boolean | string;
    }): void;
    scrollTo(
      y: number,
      options?: {
        duration?: number;
        smooth?: boolean | string;
      }
    ): void;
    scrollMore(
      y: number,
      options?: {
        duration?: number;
        smooth?: boolean | string;
      }
    ): void;
  }

  export const animateScroll: animateScroll;
}
