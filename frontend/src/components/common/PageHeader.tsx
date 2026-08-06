interface PageHeaderProps {
  title: string;
  description: string;
}

export default function PageHeader({
  title,
  description,
}: PageHeaderProps) {
  return (
    <div>
      <h1 className="text-4xl font-bold">
        {title}
      </h1>

      <p className="mt-2 text-slate-500">
        {description}
      </p>
    </div>
  );
}