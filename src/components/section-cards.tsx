import {
  IconArrowRight,
  IconHomeCog,
  IconLicense,
  IconListDetails,
  IconSwitchHorizontal,
  type Icon as TablerIcon,
} from "@tabler/icons-react";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getItemTypes } from "@/lib/ItemTypesService";
import { getRooms } from "@/lib/roomService";
import { getItems } from "@/lib/itemService";
import { getTransactions } from "@/lib/transactionService";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

interface InfoCardProps {
  title: string;
  value: number;
  icon: TablerIcon;
  to: string;
  isLoading: boolean;
}

const InfoCard = ({
  title,
  value,
  icon: Icon,
  to,
  isLoading,
}: InfoCardProps) => (
  <Card className="@container/card hover:bg-muted/50 transition-colors">
    <Link to={to} className="flex flex-col h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardDescription>{title}</CardDescription>
          <Icon className="size-5 text-muted-foreground" />
        </div>
        {isLoading ? (
          <Skeleton className="h-8 w-2/5 mt-1" />
        ) : (
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {value}
          </CardTitle>
        )}
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1.5 text-sm mt-auto">
        <div className="line-clamp-1 flex items-center gap-2 font-medium text-primary">
          Lihat Semua <IconArrowRight className="size-4" />
        </div>
      </CardFooter>
    </Link>
  </Card>
);

export function SectionCards() {
  const [counts, setCounts] = useState({
    itemTypes: 0,
    rooms: 0,
    items: 0,
    transactions: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [itemTypesRes, roomsRes, itemsRes, transactionsRes] =
          await Promise.all([
            getItemTypes({ limit: 1 }),
            getRooms({ limit: 1 }),
            getItems({ limit: 1 }),
            getTransactions({ limit: 1 }),
          ]);

        setCounts({
          itemTypes: itemTypesRes.pageInfo?.total_data ?? 0,
          rooms: roomsRes.pageInfo?.total_data ?? 0,
          items: itemsRes.pageInfo?.total_data ?? 0,
          transactions: transactionsRes.pageInfo?.total_data ?? 0,
        });
      } catch (error) {
        toast.error("Failed to fetch dashboard counts.");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCounts();
  }, []);

  const cardData = [
    {
      title: "Total Item Types",
      value: counts.itemTypes,
      icon: IconListDetails,
      to: "/admin/item-types",
    },
    {
      title: "Total Rooms",
      value: counts.rooms,
      icon: IconHomeCog,
      to: "/admin/rooms",
    },
    {
      title: "Total Items",
      value: counts.items,
      icon: IconLicense,
      to: "/admin/items",
    },
    {
      title: "Total Transactions",
      value: counts.transactions,
      icon: IconSwitchHorizontal,
      to: "/admin/transactions",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {cardData.map((card) => (
        <InfoCard
          key={card.title}
          title={card.title}
          value={card.value}
          icon={card.icon}
          to={card.to}
          isLoading={isLoading}
        />
      ))}
    </div>
  );
}
