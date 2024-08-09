'use client'

import * as z from 'zod';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/button';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select';
import { useRouter } from 'next/navigation';
import { URLS } from '../../_urls/urls';
import { useIndexStore } from '~/stores/global-store';


const formSchema = z.object({
  name: z.string().trim().min(1, {message: "Et navn er obligatorisk"}),
  listId: z.number(),
  quantity: z.number().nullable(),
})

export default function CreateList(){
      const router = useRouter();
      const {urlOnSuccess, listId: idOfDatabaseList} = useIndexStore();
      const form = useForm<z.infer<typeof formSchema>>({
        // Take formschema and map schema and zod, so it is connected.
        resolver: zodResolver(formSchema),
        defaultValues: {
          name: "",
          listId: idOfDatabaseList,
          quantity: 1,
        //   type: ListStatus.STOCKING,
        }
      });

      const inputFormat = 'w-3/4 sm:w-2/4 mt-4 mb-4' ;
      const defaultTextFormat = 'text-center justify-center';
      
      // wont fire if form invalid, because of z setup with forms.
      const handleSubmit = async (values: z.infer<typeof formSchema>) => {
        if(values.name === '') return;
        if(!values.listId) return;


        const res = await fetch('/api/list-items', {
          method: 'POST',
          headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),

        })
        
        if(res.status !== 200){
                console.error("Error when adding item to list")
                return router.push(URLS.HOME)
          }

        
        
        return router.push(urlOnSuccess) 
        
      }

      return (
        <div className='h-[vh80]'>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className='flex flex-col items-center flex-1'>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => {
                  // Using react context, will display formMessage for this field.
                  return (
                    <FormItem className={inputFormat}>
                      <FormLabel>Navn på ting der skal tilføjes</FormLabel>
                      <FormControl>
                        <Input className={defaultTextFormat} placeholder="Mælk, Vådservietter, etc." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <Button disabled={form.formState.isSubmitting} className='mt-80 w-1/4 sm:mt-6 sm:w-2/4' type="submit">Tilføj</Button>
            </form>
          </Form>
        </div>
      );

}
