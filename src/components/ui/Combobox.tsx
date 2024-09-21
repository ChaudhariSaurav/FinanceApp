"use client";

import * as React from "react";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "../custom/button";

interface LoanType {
  value: string;
  label: string;
}

const loanTypes: LoanType[] = [
  { value: 'E', label: '10,000 Loan (E)' },
  { value: 'J', label: '20,000 Loan (J)' },
  { value: 'O', label: '30,000 Loan (O)' },
  { value: 'T', label: '40,000 Loan (T)' },
  { value: 'Y', label: '50,000 Loan (Y)' },
];

interface ComboboxProps {
  onSelect: (value: string) => void;
  value: string; // Added value prop for controlled input
  placeholder?: string;
}

export function Combobox({ onSelect, value, placeholder }: ComboboxProps) {
  const [open, setOpen] = React.useState(false);

  const handleSelect = (currentValue: string) => {
    setOpen(false);
    onSelect(currentValue);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value
            ? loanTypes.find((type) => type.value === value)?.label
            : placeholder || "Select loan type..."}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search loan type..." className="h-9" />
          <CommandList>
            <CommandEmpty>No loan type found.</CommandEmpty>
            <CommandGroup>
              {loanTypes.map((type) => (
                <CommandItem
                  key={type.value}
                  onSelect={() => handleSelect(type.value)} // Pass value directly
                >
                  {type.label}
                  <CheckIcon
                    className={cn(
                      "ml-auto h-4 w-4",
                      value === type.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
