import InteractionMenu from "./features/intersaction-menu/components/IntersactionMenu";
import { FaBiking, FaCarSide, FaSpa } from "react-icons/fa";
import { FaCcVisa } from "react-icons/fa";
import { FaDove } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import { FaHeartBroken } from "react-icons/fa";
import { FaMonero } from "react-icons/fa";
import { AudioEffectsProvider } from "./hooks/use-audio-effects";
import { FaSackDollar } from "react-icons/fa6";

const categories = [
  {
    id: "cat-1",
    name: "Furniture",
    description: "Add description here fasfasfasfasfasfasfasf",
    Icon: FaCarSide,
    subcategories: [
      { id: "sc-1", name: "Sofas", Icon: FaMonero },
      { id: "sc-2", name: "Beds", Icon: FaMonero },
      { id: "sc-3", name: "Tables", Icon: FaMonero },
    ],
  },
  {
    id: "cat-2",
    name: "Electronics",
    description: "Add description here",
    Icon: FaCcVisa,
    subcategories: [
      { id: "sc-4", name: "Phones", Icon: FaMonero },
      { id: "sc-5", name: "TVs", Icon: FaMonero },
      { id: "sc-6", name: "Laptops", Icon: FaMonero },
    ],
  },
  {
    id: "cat-3",
    name: "Clothes",
    description: "Add description here",
    Icon: FaDove,
    subcategories: [
      { id: "sc-7", name: "Men", Icon: FaMonero },
      { id: "sc-8", name: "Women", Icon: FaMonero },
      { id: "sc-9", name: "Kids", Icon: FaMonero },
      { id: "sc-10", name: "Accessories", Icon: FaMonero },
    ],
  },
  {
    id: "cat-4",
    name: "Toys",
    description: "Add description here",
    Icon: FaEye,
    subcategories: [
      { id: "sc-11", name: "Action", Icon: FaMonero },
      { id: "sc-12", name: "Puzzles", Icon: FaMonero },
    ],
  },
  {
    id: "cat-5",
    name: "Books",
    description: "Add description here",
    Icon: FaGithub,
    subcategories: [
      { id: "sc-13", name: "Fiction", Icon: FaMonero },
      { id: "sc-14", name: "Non-Fiction", Icon: FaMonero },
      { id: "sc-15", name: "Comics", Icon: FaMonero },
    ],
  },
  {
    id: "cat-6",
    name: "Garden",
    Icon: FaHeartBroken,
    description: "Add description here",
    subcategories: [
      { id: "sc-16", name: "Plants", Icon: FaMonero },
      { id: "sc-17", name: "Tools", Icon: FaMonero },
    ],
  },
  {
    id: "cat-7",
    name: "Sports",
    description: "Add description here",
    Icon: FaBiking,
    subcategories: [
      { id: "sc-18", name: "Fitness", Icon: FaMonero },
      { id: "sc-19", name: "Outdoor", Icon: FaMonero },
      { id: "sc-20", name: "Equipment", Icon: FaMonero },
    ],
  },
  {
    id: "cat-8",
    name: "Beauty & Health",
    description: "Add description here",
    Icon: FaSpa,
    subcategories: [
      { id: "sc-21", name: "Skincare", Icon: FaMonero },
      { id: "sc-22", name: "Haircare", Icon: FaMonero },
      { id: "sc-23", name: "Wellness", Icon: FaMonero },
    ],
  },
  {
    id: "cat-9",
    name: "New Category",
    description: "Add description here",
    Icon: FaSackDollar,
    subcategories: [],
  },
];

/** {
    id: "cat-9",
    name: "New Category",
    description: "Add description here",
    Icon: FaSackDollar,
    subcategories: [],
  }, */

export default function App() {
  return (
    <AudioEffectsProvider>
      <div className="min-h-screen flex items-center justify-center bg-white p-6">
        <InteractionMenu
          categories={categories}
          size={460}
          itemSize={76}
          onHover={(id) => console.log("hover", id)}
          onSelect={(id) => console.log("select/open", id)}
          className="bg-transparent"
          colors={{
            bg: "radial-gradient(circle at center, #9c9bb3 0%, #9c9bb3 38%, #7c7885 83%)",
            itemBg:
              "linear-gradient(180deg, rgba(79,70,229,1), rgba(59,48,98,1))",
            itemShadow: "rgba(0,0,0,0.35)",
            centerBg:
              "radial-gradient(circle at center, #3a376e 0%, #3a376e 12%, #272138 53%)",
            arcFill: "rgba(99,102,241,0.08)",
            text: "#ffffff",
          }}
        />
      </div>
    </AudioEffectsProvider>
  );
}
