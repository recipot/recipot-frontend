export interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  color?: string;
}

// 감정 관련 타입들을 re-export
export * from './emotion.types';
