import { useState } from "react";
import toast from "react-hot-toast";
import dayjs from "dayjs";
import { mainSchema } from "@/api/schema";
import api from "@/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useUser } from "@/features/pricing/hooks";
import { Button } from "@/components/ui/button";

const getCardNumberString = (last4?: string) => {
  if (!last4) return "No saved card";
  return `•••• •••• •••• ${last4}`;
};

const getCardExpiryDate = ({
  cardExpiryMonth,
  cardExpiryYear,
  format,
}: {
  cardExpiryMonth: number;
  cardExpiryYear: number;
  format?: string;
}) => {
  return dayjs()
    .month(cardExpiryMonth - 1)
    .year(cardExpiryYear)
    .format(format || "MM/YYYY");
};

export const getUserHasCard = (
  user: mainSchema["UserInfoDTO"] | undefined
): boolean => {
  if (!user) return false;
  return Boolean(
    user.cardBrand &&
      user.cardLast4 &&
      user.cardExpiryMonth != null &&
      user.cardExpiryYear != null
  );
};

export default function PaymentCard({
  editable,
  onEdit,
  onRemove,
}: {
  editable?: boolean;
  onEdit: () => void;
  onRemove: () => void;
}) {
  const { user } = useUser();
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleRemoveCard = async () => {
    try {
      await api.payment.removeCard();
      toast.success("Remove card successfully");
      setDialogOpen(false);
      onRemove();
    } catch (error) {
      console.error("Failed to remove card:", error);
      toast.error("Failed to remove card");
    }
  };

  if (!user || !getUserHasCard(user)) return null;

  return (
    <div className="flex p-5 gap-2 justify-between items-center min-w-max w-full bg-background border-2 rounded-2xl">
      <div className="flex flex-col">
        <div className="flex items-center gap-4">
          <p className="font-semibold text-xl capitalize">
            {user.cardBrand?.toString().replace(/_/g, " ")}
          </p>
          <p className="text-xs">
            Exp.{" "}
            {getCardExpiryDate({
              cardExpiryMonth: user.cardExpiryMonth!,
              cardExpiryYear: user.cardExpiryYear!,
            })}
          </p>
        </div>
        <p>{getCardNumberString(user.cardLast4!)}</p>
      </div>

      {editable ? (
        <div className="flex gap-2">
          <button onClick={() => onEdit()}>✏️</button>
          <button onClick={() => setDialogOpen(true)}>X</button>
        </div>
      ) : null}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="left-[50%]">
          <DialogHeader>
            <DialogTitle>Confirm Removal</DialogTitle>
            <DialogDescription>
              <p>Are you sure you want to remove this card?</p>

              <div className="mt-2 flex flex-row justify-end gap-2">
                <Button
                  variant="secondary"
                  onClick={() => setDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleRemoveCard}>
                  Confirm
                </Button>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
