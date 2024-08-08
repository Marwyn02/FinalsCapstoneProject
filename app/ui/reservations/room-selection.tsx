"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function RoomSelection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-2 justify-center items-center py-5">
      <h3 className="text-xl font-medium text-gray-500">
        <span className="text-black font-semibold">Find</span> your perfect
        room.
      </h3>

      <FormField
        name="room"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                value={field.value} // Changed from defaultValue
                className="flex flex-col space-y-1"
              >
                <FormItem className="flex items-center space-x-0 space-y-0">
                  <FormControl>
                    <RadioGroupItem
                      value="The Solitary Oasis"
                      className="peer hidden"
                    />
                  </FormControl>
                  <FormLabel className="block h-[250px] w-full cursor-pointer rounded-md border border-border p-4 font-normal shadow-sm duration-500 hover:border-black peer-aria-checked:border-black peer-aria-checked:bg-black peer-aria-checked:text-white peer-aria-checked:ring-ring">
                    The Solitary Oasis
                  </FormLabel>
                </FormItem>

                <FormItem className="flex items-center space-x-0 space-y-0">
                  <FormControl>
                    <RadioGroupItem
                      value="Coastal Supreme"
                      className="peer hidden"
                    />
                  </FormControl>
                  <FormLabel className="block h-[250px] w-full cursor-pointer rounded-md border border-border p-4 font-normal shadow-sm duration-500 hover:border-black peer-aria-checked:border-black peer-aria-checked:bg-black peer-aria-checked:text-white peer-aria-checked:ring-ring">
                    Coastal Supreme
                  </FormLabel>
                </FormItem>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
