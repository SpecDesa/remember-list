"use client";
import ListeClient from "~/app/_components/_liste/liste-client";
import { useSearchParams } from "next/navigation";
import { ListAction } from "../page";
import { useRouter } from "next/navigation";
import { useIndexStore } from "~/stores/global-store";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select';
import { useForm } from "react-hook-form";
import { Input } from '~/components/ui/input';
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from '~/components/ui/button';
import { URLS } from "~/app/_urls/urls";

export const dynamic = "force-dynamic";

const formSchema = z.object({
//   name: z.string().trim().min(1, { message: "Et navn er obligatorisk" }),
  email: z.string().email(),
});

export default function AddUserToList() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const action = searchParams.get("action") as ListAction;
  const { listId } = useIndexStore();

  const form = useForm<z.infer<typeof formSchema>>({
    // Take formschema and map schema and zod, so it is connected.
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });

  const inputFormat = 'w-3/4 sm:w-2/4 mt-4 mb-4' ;
      const defaultTextFormat = 'text-center justify-center bg-white text-black';


      // wont fire if form invalid, because of z setup with forms.
      const handleSubmit = async (values: z.infer<typeof formSchema>) => {
        if(values.email === '') return;

        const res = await fetch('/api/lists/add-user', {
          method: 'POST',
          headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({...values, listId: listId}),

        })
        
        if(res.status !== 200){
                console.error("Error when creating list")
                return; 
          }

        
        
        return router.push(URLS.HOME) 
        
      }

  if (!listId) {
    console.error("ListId not found");
  }

  return (
    <div className="flex mt-12">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className='flex flex-col items-center flex-1'>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => {
              // Using react context, will display formMessage for this field.
              return (
                <FormItem className={inputFormat}>
                  <FormLabel className="mb-2">Email på huskeliste bruger</FormLabel>
                  <FormControl>
                    <Input className={defaultTextFormat} placeholder="Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <Button disabled={form.formState.isSubmitting} className='mt-64 sm:mt-6 sm:w-2/4' type="submit">Tilføj bruger </Button>
        </form>
      </Form>
    </div>
  );

}
