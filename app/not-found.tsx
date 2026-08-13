import Link from "next/link";
import { Container } from "@/components/ui/section";

export default function NotFound() {
  return (
    <div className="py-20">
      <Container className="text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--gvozd-red)]">
          404
        </p>
        <h1 className="mt-3 text-3xl font-extrabold">Страница не найдена</h1>
        <p className="mx-auto mt-3 max-w-md text-[var(--gvozd-gray-500)]">
          Такой страницы нет или она была перемещена. Вернитесь на главную или
          воспользуйтесь поиском.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="inline-flex h-11 items-center rounded-md bg-[var(--gvozd-red)] px-5 text-sm font-semibold text-white"
          >
            На главную
          </Link>
          <Link
            href="/catalog"
            className="inline-flex h-11 items-center rounded-md border-2 border-[var(--gvozd-graphite)] px-5 text-sm font-semibold"
          >
            В каталог
          </Link>
        </div>
      </Container>
    </div>
  );
}
