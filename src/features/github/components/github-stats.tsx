"use client";

import useSWR from "swr";
import type { GitHub } from "@/types/github";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const fetcher = (url: string) => fetch(url).then((res) => res.json() as Promise<GitHub>);

export function GitHubStats() {
  const { data, isLoading, error } = useSWR<GitHub>("/api/github", fetcher);

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-3">
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
      </div>
    );
  }

  if (error || !data) {
    return <p className="text-sm text-muted-foreground">No se pudieron cargar las estadísticas.</p>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Repositorios</CardTitle>
        </CardHeader>
        <CardContent className="text-2xl font-semibold">{data.repos}</CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Stars</CardTitle>
        </CardHeader>
        <CardContent className="text-2xl font-semibold">{data.stars}</CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Seguidores</CardTitle>
        </CardHeader>
        <CardContent className="text-2xl font-semibold">{data.followers}</CardContent>
      </Card>
    </div>
  );
}
