import React from 'react'
import { Button } from './ui/button';
import { LucideIcon } from 'lucide-react';
import { IconType } from 'react-icons/lib';
import { cn } from '@/lib/utils';

interface SidebarSwitcherProps {
    icon: LucideIcon | IconType;
    label: string;
    isActive?: boolean;
};

const SidebarSwitcher = ({ icon: Icon, label, isActive }: SidebarSwitcherProps) => {
  return (
    <div className='flex flex-col items-center justify-center gap-y-0.5 cursor-pointer group'>
        <Button variant="outline" size="icon" className={cn("size-9 p-2 group-hover:bg-accent/20", isActive && "bg-accent/20")}>
        <Icon className='size-5 text-[#fff] group-hover:scale-110 transition-all' />
        </Button>

        <span className='text-[11px] text-[#fff] group-hover:text-accent'>{label}</span>
    </div>
  )
}

export default SidebarSwitcher