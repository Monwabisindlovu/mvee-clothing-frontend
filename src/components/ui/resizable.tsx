'use client';

import React from 'react';
import { GripVertical } from 'lucide-react';
import { Group, Panel, type GroupProps, type PanelProps } from 'react-resizable-panels';
import { cn } from '@/lib/utils';

const ResizablePanelGroup = ({ className, ...props }: GroupProps) => (
  <Group
    className={cn('flex h-full w-full data-[panel-group-direction=vertical]:flex-col', className)}
    {...props}
  />
);

const ResizablePanel = (props: PanelProps) => <Panel {...props} />;

// Custom handle via CSS + optional Grip icon
const ResizableHandle = ({
  withHandle,
  className,
}: {
  withHandle?: boolean;
  className?: string;
}) => (
  <div
    className={cn(
      'relative flex w-px items-center justify-center bg-border cursor-col-resize data-[panel-group-direction=vertical]:h-px data-[panel-group-direction=vertical]:w-full',
      className
    )}
  >
    {withHandle && (
      <div className="z-10 flex h-4 w-3 items-center justify-center rounded-sm border bg-border">
        <GripVertical className="h-2.5 w-2.5" />
      </div>
    )}
  </div>
);

export { ResizablePanelGroup, ResizablePanel, ResizableHandle };
