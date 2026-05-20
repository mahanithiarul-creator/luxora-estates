import React from 'react';

export default function GlassPanel({ children, className = '', style = {} as any }: any) {
  return (
    <div className={"glass fancy-border rounded-2xl " + className} style={{ padding: 18, ...style }}>
      {children}
    </div>
  );
}
