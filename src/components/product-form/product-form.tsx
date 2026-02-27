"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ProductType } from "@/types/product-type"
import { ProductAutoFill } from "@/types/product-auto-fill"
import { useState } from "react"
import { Loader2, Sparkles, Send } from "lucide-react"
import { toast } from "sonner"

const formSchema = z.object({
  name: z.string().min(2, "Название слишком короткое"),
  type: z.enum(["product", "service"]),
  description_short: z.string().default(""),
  description_long: z.string().default(""),
  seoKeywords: z.array(z.string()).default([]),
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

type ProductFormProps = {
  onRequestAutoFill?: (name: string) => Promise<ProductAutoFill>;
};

function ProductForm({ onRequestAutoFill }: ProductFormProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      name: "",
      type: "product",
      description_short: "",
      description_long: "",
      seoKeywords: [], // ТЕПЕРЬ ТУТ ЕСТЬ МАССИВ (было пропущено)
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

  // Эта функция сработает, если ты нажал "Опубликовать", но в форме ошибки
  const onInvalid = (errors: any) => {
    console.error("Ошибки валидации:", errors);
    toast.error("Пожалуйста, исправьте ошибки в форме");
  }

  async function onSubmit(values: FormValues) {
    const payload: ProductType = {
      ...values,
      type: values.type as "product" | "service",
      seo_keywords: values.seoKeywords,
      global_category_id: 127,
      chatting_percent: 4,
      latitude: 55.7711953,
      longitude: 49.10211794999999,
    };

    try {
      const response = await fetch('/api/create-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.success("Товар успешно создан!");
        form.reset();
      } else {
        toast.error("Ошибка при создании на сервере");
      }
    } catch (error) {
      toast.error("Сетевая ошибка");
    }
  }

  const handleAutoFillSEO = async () => {
    const name = form.getValues("name");
    if (!name) {
      toast.warning("Введите название для генерации");
      return;
    }
    if (!onRequestAutoFill) return;

    try {
      setIsGenerating(true);
      const data = await onRequestAutoFill(name);

      form.setValue("description_short", data.description, { shouldDirty: true });
      form.setValue("description_long", data.description, { shouldDirty: true });
      form.setValue("seo_title", data.seoTitle, { shouldDirty: true });
      form.setValue("seo_description", data.seoDescription, { shouldDirty: true });
      form.setValue("seoKeywords", data.seoKeywords || [], { shouldDirty: true });
      // Если категория приходит строкой, приводим к числу
      form.setValue("category", Number(data.category), { shouldDirty: true });

      toast.success("SEO данные заполнены!");
    } catch (error) {
      toast.error("Ошибка ИИ генерации");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto my-10 shadow-md">
      <CardHeader><CardTitle>Новая карточка товара</CardTitle></CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem>
                  <FormLabel>Название</FormLabel>
                  <FormControl><Input placeholder="Введите название" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="code" render={({ field }) => (
                <FormItem>
                  <FormLabel>Артикул</FormLabel>
                  <FormControl><Input placeholder="Напр. ART-101" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            <FormField control={form.control} name="description_short" render={({ field }) => (
              <FormItem>
                <FormLabel>Краткое описание</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="description_long" render={({ field }) => (
              <FormItem>
                <FormLabel>Полное описание</FormLabel>
                <FormControl><Textarea {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="marketplace_price" render={({ field }) => (
                <FormItem>
                  <FormLabel>Цена</FormLabel>
                  <FormControl><Input type="number" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="address" render={({ field }) => (
                <FormItem>
                  <FormLabel>Адрес</FormLabel>
                  <FormControl><Input placeholder="Улица, город" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            <FormField control={form.control} name="seo_title" render={({ field }) => (
              <FormItem>
                <FormLabel>SEO Title</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="seo_description" render={({ field }) => (
              <FormItem>
                <FormLabel>SEO Description</FormLabel>
                <FormControl><Textarea {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleAutoFillSEO}
                disabled={isGenerating}
              >
                {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4 text-purple-500" />}
                ИИ Генерация
              </Button>
              <Button type="submit" className="flex-1" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Send className="mr-2 h-4 w-4" />
                )}
                Опубликовать
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

export default ProductForm