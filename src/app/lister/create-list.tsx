'use client'

import * as z from 'zod';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import { ListStatus } from '~/server/db/types';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select';



const formSchema = z.object({
  name: z.string(),
  type: z.nativeEnum(ListStatus),
})

export default function CreateList(){
      const form = useForm<z.infer<typeof formSchema>>({
        // Take formschema and map schema and zod, so it is connected.
        resolver: zodResolver(formSchema),
        defaultValues: {
          name:"",
          type: ListStatus.STOCKING,
        }
      });

      const inputFormat = 'w-3/4 md:w-2/4' ;
      const defaultTextFormat = 'text-center justify-center';
      
      // wont fire if form invalid, because of z setup with forms.
      const handleSubmit = (values: z.infer<typeof formSchema>) => {
        console.log("asd", values)
      }

      return (
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className='flex flex-col space-y-8 items-center flex-1'>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => {
                  // Using react context, will display formMessage for this field.
                  return (
                    <FormItem className={inputFormat}>
                      <FormLabel>Navn på liste</FormLabel>
                      <FormControl>
                        <Input className={defaultTextFormat} placeholder="Navn" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <FormField

                control={form.control}
                name="type"
                render={({ field }) => {
                  // Using react context, will display formMessage for this field.
                  return (
                    <FormItem className={inputFormat}>
                      <FormLabel>Type af liste</FormLabel>
                      <Select onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger className={defaultTextFormat}>
                            <SelectValue  placeholder="Vælg type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.values(ListStatus).map((status) => {
                            return (
                              <SelectItem
                                key={`select_${status}`}
                                value={`${status}`}
                                className={defaultTextFormat}
                              >{status}</SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <Button type="submit">Tilføj liste </Button>
            </form>
          </Form>
        </div>
      );


     

      
}
