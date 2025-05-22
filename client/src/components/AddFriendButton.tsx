import { Button, buttonVariants } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { chatStore } from "@/stores/chatStore";

import { UserPlus, Copy } from "lucide-react";

import {  useEffect, useState } from "react";
import toast from "react-hot-toast";

function AddFriendButton() {
  const [friendId, setFriendId] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { addFriend } = chatStore();
  const { currentUser, fetchCurrentUser } = chatStore(); 

  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  const handleAddFriend = async () => {
    if (!friendId.trim()) {
      toast.error("Будь ласка, введіть ID друга");
      return;
    }

    try {
      await addFriend(friendId);
      toast.success("Друга успішно додано");
      setFriendId("");
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error adding friend:", error);
      toast.error("Не вдалося додати друга");
    }
  };

  const copyUserId = () => {
    if (!currentUser) return;
    navigator.clipboard.writeText(currentUser);
    toast.success("ID скопійовано");
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <button
          className={cn(
            buttonVariants({
              variant: "ghost",
              className: "w-full justify-start text-white hover:bg-zinc-800",
            })
          )}
        >
          <UserPlus className="mr-2 h-4 w-4" />
          <span>Додати друга</span>
        </button>
      </DialogTrigger>
      <DialogContent className="bg-zinc-900 border-zinc-700">
        <DialogHeader>
          <DialogTitle>Додати друга</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          {/* Секція з ID поточного користувача */}
          <div className="space-y-2">
            <p className="text-sm text-zinc-400">Ваш ID (можете поділитися):</p>
            <div className="flex items-center gap-2">
              <Input
                value={currentUser || "Завантаження..."}
                readOnly
                className="bg-zinc-800 border-zinc-700"
              />
              <Button
                size="icon"
                variant="outline"
                onClick={copyUserId}
                disabled={!currentUser}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Секція для введення ID друга */}
          <div className="space-y-2">
            <p className="text-sm text-zinc-400">Введіть ID друга:</p>
            <Input
              value={friendId}
              onChange={(e) => setFriendId(e.target.value)}
              placeholder="Вставте ID друга тут"
              className="bg-zinc-800 border-zinc-700"
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button 
              variant="outline" 
              onClick={() => setIsDialogOpen(false)}
            >
              Скасувати
            </Button>
            <Button onClick={handleAddFriend}>
              Додати
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default AddFriendButton;
