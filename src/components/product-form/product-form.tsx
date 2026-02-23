"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {ProductType} from "@/types/product-type";

const formSchema = z.object({
  name: z.string().min(2, "Название слишком короткое"),
  type: z.enum(["product", "service"]),
  description_short: z.string().default(""),
  description_long: z.string().default(""),
  code: z.string().min(1, "Артикул обязателен"),
  unit: z.coerce.number().default(116),
  category: z.coerce.number().default(2477),
  cashback_type: z.string().default("lcard_cashback"),
  seo_title: z.string().default(""),
  seo_description: z.string().default(""),
  marketplace_price: z.coerce.number().min(0).default(0),
  address: z.string().default(""),
})

type FormValues = z.infer<typeof formSchema>;

function ProductForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      name: "",
      type: "product",
      description_short: "",
      description_long: "",
      code: "",
      unit: 116,
      category: 2477,
      cashback_type: "lcard_cashback",
      seo_title: "",
      seo_description: "",
      marketplace_price: 0,
      address: "",
    },
  })

  async function onSubmit(values: FormValues) {
    const payload: ProductType = {
      ...values,
      type: values.type as "product" | "service",
      seo_keywords: ["SEO", "Ключи"],
      global_category_id: 127,
      chatting_percent: 4,
      latitude: 55.7711953,
      longitude: 49.10211794999999
    }

    try {
      const response = await fetch(
        '/api/create-product',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      )

      if (response.ok) {
        alert("Товар успешно создан!")
        form.reset()
      } else {
        alert("Ошибка при создании")
      }
    } catch (error) {
      console.error("Ошибка при отправке:", error)
    }
  }

  return (
    <Card className="max-w-2xl mx-auto my-10">
      <CardHeader><CardTitle>Новая карточка товара</CardTitle></CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem><FormLabel>Название</FormLabel><FormControl><Input placeholder="Введите название" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="code" render={({ field }) => (
                <FormItem><FormLabel>Артикул</FormLabel><FormControl><Input placeholder="Напр. ART-101" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            </div>

            <FormField control={form.control} name="description_short" render={({ field }) => (
              <FormItem><FormLabel>Краткое описание</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />

            <FormField control={form.control} name="description_long" render={({ field }) => (
              <FormItem><FormLabel>Полное описание</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
            )} />

            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="marketplace_price" render={({ field }) => (
                <FormItem><FormLabel>Цена</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="address" render={({ field }) => (
                <FormItem><FormLabel>Адрес</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            </div>

            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Отправка..." : "Опубликовать в TableCRM"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

export  default ProductForm