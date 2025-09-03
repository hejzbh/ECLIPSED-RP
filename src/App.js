import React from "react";
import InteractionMenu from "./features/intersaction-menu/components/IntersactionMenu";

const categories = [
  {
    id: "cat-1",
    name: "Furniture",
    subcategories: [
      { id: "sc-1", name: "Sofas" },
      { id: "sc-2", name: "Beds" },
      { id: "sc-3", name: "Tables" },
    ],
  },
  {
    id: "cat-2",
    name: "Electronics",
    subcategories: [
      { id: "sc-4", name: "Phones" },
      { id: "sc-5", name: "TVs" },
    ],
  },
  {
    id: "cat-3",
    name: "Clothes",
    subcategories: [
      { id: "sc-6", name: "Men" },
      { id: "sc-7", name: "Women" },
      { id: "sc-8", name: "Kids" },
      { id: "sc-9", name: "Accessories" },
    ],
  },
  {
    id: "cat-4",
    name: "Toys",
    subcategories: [
      { id: "sc-10", name: "Action" },
      { id: "sc-11", name: "Puzzles" },
    ],
  },
  {
    id: "cat-5",
    name: "Books",
    subcategories: [{ id: "sc-12", name: "Fiction" }],
  },
  {
    id: "cat-6",
    name: "Garden",
    subcategories: [
      { id: "sc-13", name: "Plants" },
      { id: "sc-14", name: "Tools" },
    ],
  },
];

export default function App() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-6">
      <InteractionMenu
        categories={categories}
        size={520}
        centerSize={160}
        itemSize={64}
        ringThickness={48}
        subArcSpan={70}
        onHover={(id) => console.log("hover", id)}
        onSelect={(id) => console.log("select/open", id)}
        className="bg-transparent"
        colors={{
          itemBg: "linear-gradient(180deg, #5b21b6, #2f1658)",
          itemShadow: "rgba(0,0,0,0.5)",
          centerBg:
            "linear-gradient(180deg, rgba(30,41,59,1), rgba(17,24,39,1))",
          arcFill: "rgba(255,255,255,0.04)",
        }}
      />
    </div>
  );
}
