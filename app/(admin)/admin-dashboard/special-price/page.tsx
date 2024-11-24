import { SpecialPriceFetch } from "@/features/specialDate/api/SpecialPriceFetch";
import SpecialPriceForm from "@/features/specialDate/admin/SpecialPriceForm";
import SpecialDateList from "@/features/specialDate/admin/SpecialDateList";

const Page = async () => {
  const specialPrices = await SpecialPriceFetch();
  return (
    <main className="grid grid-cols-1 lg:grid-cols-3 h-screen">
      <SpecialPriceForm specialPrice={specialPrices} />
      <SpecialDateList specialPrices={specialPrices} />
    </main>
  );
};

export default Page;
