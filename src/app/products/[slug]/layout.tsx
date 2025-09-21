// src/app/products/[slug]/layout.tsx
export default function ProductLayout({
    children,
    modal,
  }: {
    children: React.ReactNode;
    modal: React.ReactNode;
  }) {
    return (
      <div>
        {children}
        {modal}
      </div>
    );
  }
  