
# Implementación de Supabase para PlaymakerAI

Este documento describe cómo implementar las tablas y funciones edge en Supabase para la funcionalidad de backend de PlaymakerAI.

## Tablas en Supabase

### 1. Tabla: users

```sql
create table users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  company_name text,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null,
  role text check (role in ('admin', 'user')) default 'user' not null
);

-- Configurar RLS (Row Level Security)
alter table users enable row level security;

-- Políticas RLS
create policy "Users can view own data" 
  on users for select 
  using (auth.uid() = id);

create policy "Users can update own data" 
  on users for update 
  using (auth.uid() = id);

-- Trigger para actualizar el campo updated_at
create or replace function update_modified_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_users_updated_at
before update on users
for each row
execute function update_modified_column();
```

### 2. Tabla: audit_reports

```sql
create table audit_reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade not null,
  title text not null,
  url text,
  uploaded_files jsonb,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null,
  status text check (status in ('pending', 'processing', 'completed', 'failed')) default 'pending' not null,
  score integer,
  score_breakdown jsonb,
  summary text,
  detailed_analysis jsonb
);

-- Configurar RLS
alter table audit_reports enable row level security;

-- Políticas RLS
create policy "Users can view own audit reports" 
  on audit_reports for select 
  using (auth.uid() = user_id);

create policy "Users can insert own audit reports" 
  on audit_reports for insert 
  with check (auth.uid() = user_id);

create policy "Users can update own audit reports" 
  on audit_reports for update 
  using (auth.uid() = user_id);

create policy "Users can delete own audit reports" 
  on audit_reports for delete 
  using (auth.uid() = user_id);

-- Trigger para actualizar el campo updated_at
create trigger update_audit_reports_updated_at
before update on audit_reports
for each row
execute function update_modified_column();
```

### 3. Tabla: user_settings

```sql
create table user_settings (
  user_id uuid primary key references users(id) on delete cascade,
  notification_preferences jsonb default '{"email": true, "in_app": true}' not null,
  report_format_preferences jsonb default '{"include_competitor_analysis": true, "include_recommendations": true, "include_visual_elements": true}' not null,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

-- Configurar RLS
alter table user_settings enable row level security;

-- Políticas RLS
create policy "Users can view own settings" 
  on user_settings for select 
  using (auth.uid() = user_id);

create policy "Users can update own settings" 
  on user_settings for update 
  using (auth.uid() = user_id);

create policy "Users can insert own settings" 
  on user_settings for insert 
  with check (auth.uid() = user_id);

-- Trigger para actualizar el campo updated_at
create trigger update_user_settings_updated_at
before update on user_settings
for each row
execute function update_modified_column();
```

## Edge Functions

### 1. Función: audit-engine

Archivo: `supabase/functions/audit-engine/index.ts`

```typescript
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

interface RequestBody {
  report_id?: string;
  url?: string;
  files?: string[];
}

serve(async (req) => {
  // Manejo de CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { report_id, url, files } = await req.json() as RequestBody;

    if (!report_id && (!url && (!files || files.length === 0))) {
      return new Response(
        JSON.stringify({ error: "Se requiere un report_id o url/files" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    // Aquí iría la lógica del motor de auditoría
    // 1. Si se proporciona report_id, obtener el informe existente
    // 2. Si se proporciona url/files, crear un nuevo informe
    // 3. Invocar el web scraper si hay url
    // 4. Procesar los archivos subidos si los hay
    // 5. Invocar el brand scoring
    // 6. Invocar el generador de salida
    // 7. Actualizar el informe con los resultados

    // Implementación simulada
    const newReportId = report_id || crypto.randomUUID();
    
    // Actualizar estado a "processing"
    if (report_id) {
      await supabaseClient
        .from("audit_reports")
        .update({ status: "processing" })
        .eq("id", report_id);
    }

    // Simulación de procesamiento
    // En una implementación real, invocarías otras funciones y actualizarías el informe con los resultados

    return new Response(
      JSON.stringify({ 
        report_id: newReportId,
        status: "processing"
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
```

### 2. Función: web-scraper

Archivo: `supabase/functions/web-scraper/index.ts`

```typescript
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.38/deno-dom-wasm.ts";

interface RequestBody {
  url: string;
  scrape_depth?: number;
  include_images?: boolean;
}

serve(async (req) => {
  // Manejo de CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { url, scrape_depth = 1, include_images = true } = await req.json() as RequestBody;

    if (!url) {
      return new Response(
        JSON.stringify({ error: "URL es requerida" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    // Implementación del web scraper
    // Nota: Esto es una implementación básica. Para una solución real,
    // considera usar una herramienta más robusta o un servicio de scraping.
    
    const result = await scrapeUrl(url, scrape_depth, include_images);

    return new Response(
      JSON.stringify(result),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});

async function scrapeUrl(url: string, depth: number, includeImages: boolean) {
  try {
    const response = await fetch(url);
    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    // Extraer información relevante
    const title = doc.querySelector("title")?.textContent || "";
    const metaDescription = doc.querySelector('meta[name="description"]')?.getAttribute("content") || "";
    const h1s = Array.from(doc.querySelectorAll("h1")).map(el => el.textContent);
    
    // Extraer textos principales
    const mainContent = doc.querySelector("main") || doc.querySelector("body");
    const paragraphs = Array.from(mainContent.querySelectorAll("p")).map(el => el.textContent);
    
    // Extraer enlaces para scraping adicional si la profundidad > 1
    const links = [];
    if (depth > 1) {
      const anchorTags = Array.from(doc.querySelectorAll("a"));
      for (const anchor of anchorTags) {
        const href = anchor.getAttribute("href");
        if (href && href.startsWith("/") && !href.includes("#")) {
          links.push(new URL(href, url).toString());
        }
      }
    }
    
    // Extraer imágenes si se requiere
    const images = [];
    if (includeImages) {
      const imgTags = Array.from(doc.querySelectorAll("img"));
      for (const img of imgTags) {
        const src = img.getAttribute("src");
        const alt = img.getAttribute("alt") || "";
        if (src) {
          const imageUrl = src.startsWith("http") ? src : new URL(src, url).toString();
          images.push({ url: imageUrl, alt });
        }
      }
    }
    
    // Resultado final
    return {
      url,
      title,
      meta_description: metaDescription,
      h1s,
      paragraphs,
      images: includeImages ? images : [],
      links: depth > 1 ? links : [],
      // Aquí puedes agregar más datos extraídos según necesites
    };
  } catch (error) {
    console.error(`Error scraping ${url}:`, error);
    return {
      url,
      error: error.message,
    };
  }
}
```

### 3. Función: brand-scoring

Archivo: `supabase/functions/brand-scoring/index.ts`

```typescript
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

interface RequestBody {
  report_id: string;
  scraped_data: any;
  uploaded_data: any;
}

serve(async (req) => {
  // Manejo de CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { report_id, scraped_data, uploaded_data } = await req.json() as RequestBody;

    if (!report_id) {
      return new Response(
        JSON.stringify({ error: "report_id es requerido" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    // Implementación de la puntuación de marca
    // En una implementación real, aquí integrarías con un modelo de IA 
    // o aplicarías algoritmos de análisis para evaluar la marca

    // Ejemplo de estructura de puntuación (simulada)
    const scoring = {
      overall_score: 85,
      breakdown: {
        visual_consistency: 90,
        messaging: 80,
        positioning: 85,
        social_media: 75,
        website: 95
      },
      visual_analysis: {
        logo_usage: "Consistente en todas las plataformas",
        color_palette: "Bien definida y alineada con la identidad de marca",
        typography: "Coherente y legible",
        design_language: "Moderno y profesional",
        recommendations: [
          "Considerar mejorar el contraste de color en algunas áreas",
          "Asegurar que los elementos visuales sean optimizados para móvil"
        ]
      },
      messaging_analysis: {
        tone_of_voice: "Profesional y accesible",
        key_messages: "Claros y consistentes",
        communication_strategy: "Bien estructurada",
        recommendations: [
          "Desarrollar más contenido centrado en historias de éxito",
          "Refinar el mensaje principal para mayor impacto"
        ]
      }
      // Más categorías de análisis...
    };

    // Actualizar el informe en Supabase con los resultados de la puntuación
    await supabaseClient
      .from("audit_reports")
      .update({
        score: scoring.overall_score,
        score_breakdown: scoring.breakdown,
        detailed_analysis: {
          visual_analysis: scoring.visual_analysis,
          messaging_analysis: scoring.messaging_analysis,
          // Más categorías...
        },
        status: "processing" // Todavía en procesamiento hasta generar el informe final
      })
      .eq("id", report_id);

    return new Response(
      JSON.stringify(scoring),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
```

### 4. Función: output-generator

Archivo: `supabase/functions/output-generator/index.ts`

```typescript
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

interface RequestBody {
  report_id: string;
  scoring_data: any;
  include_recommendations?: boolean;
}

serve(async (req) => {
  // Manejo de CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { report_id, scoring_data, include_recommendations = true } = await req.json() as RequestBody;

    if (!report_id) {
      return new Response(
        JSON.stringify({ error: "report_id es requerido" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    // Obtener el informe actual
    const { data: reportData, error: reportError } = await supabaseClient
      .from("audit_reports")
      .select("*")
      .eq("id", report_id)
      .single();

    if (reportError || !reportData) {
      return new Response(
        JSON.stringify({ error: "No se pudo encontrar el informe" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 404,
        }
      );
    }

    // Generar resumen y contenido del informe
    // En una implementación real, usarías los datos de puntuación para crear un informe detallado,
    // posiblemente utilizando un modelo de IA para generar texto natural

    // Ejemplo de resumen (simulado)
    const summary = `
      La marca tiene una puntuación general de ${reportData.score}/100, destacando principalmente en 
      consistencia visual (${reportData.score_breakdown.visual_consistency}/100) y presencia web 
      (${reportData.score_breakdown.website}/100). Las áreas con mayor oportunidad de mejora 
      incluyen la estrategia de redes sociales (${reportData.score_breakdown.social_media}/100) 
      y la consistencia de mensajes (${reportData.score_breakdown.messaging}/100).
    `.trim();

    // Actualizar el informe con el resumen y marcar como completado
    await supabaseClient
      .from("audit_reports")
      .update({
        summary: summary,
        status: "completed",
        updated_at: new Date().toISOString()
      })
      .eq("id", report_id);

    return new Response(
      JSON.stringify({
        report_id,
        summary,
        status: "completed"
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
```

## Archivo compartido para CORS

Archivo: `supabase/functions/_shared/cors.ts`

```typescript
export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};
```
