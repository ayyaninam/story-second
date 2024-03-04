"use client";
import api from "@/api";
import Error from "@/components/FormError";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { QueryKeys } from "@/lib/queryKeys";
import { QueryObserverResult, useMutation } from "@tanstack/react-query";
import { format } from "date-fns";
import { startCase } from "lodash";
import { useCallback } from "react";
import { FieldValues, FormProvider, UseFormReturn } from "react-hook-form";
import toast from "react-hot-toast";
import Router from "next/router";
import Routes from "@/routes";

export const AccountForm = <T extends FieldValues>({
  form,
  refetch,
}: {
  form: UseFormReturn<T | any, any, T>;
  refetch: QueryObserverResult["refetch"];
}) => {
  const value = form.watch("dateOfBirth");

  const { mutateAsync, isPending: isUpdating } = useMutation({
    mutationKey: [QueryKeys.USER, QueryKeys.UPDATE],
    mutationFn: async (data: T) => {
      const transformedData: Record<string, any> = {};
      Object.entries(data).forEach(([key, value]) => {
        const _key = startCase(key).replaceAll(" ", "");
        if (_key === "DateOfBirth") {
          // Need to transform the selected date into backend supported value
          const _value = format(value, "yyyy-MM-dd");
          transformedData[_key] = _value;
          return;
        }
        transformedData[_key] = value;
      });
      return api.user.updateDetails<T>(transformedData as T);
    },
    onSuccess: async () => {
      toast.success("Profile updated successfully!");
      await refetch?.();
    },
    onError: () => {
      toast.error("Failed to update profile");
    },
  });

  const onSave = useCallback(async () => {
    await mutateAsync(form.getValues());
  }, [form, mutateAsync]);

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSave)} className="space-y-5">
        <div className="grid grid-cols-2 gap-1 sm:gap-x-20 sm:gap-y-4">
          {/* First Name & Last Name */}
          <div>
            <Label htmlFor="firstName">First name</Label>
            <Input
              {...form.register("name", { required: true })}
              type="text"
              className="w-full mt-2"
            />
            <Error control={form.control} name="firstName" />
          </div>
          <div>
            <Label htmlFor="lastName">Last name</Label>
            <Input
              {...form.register("lastName", { required: true })}
              type="text"
              className="w-full mt-2"
            />
            <Error control={form.control} name="lastName" />
          </div>

          {/* Username & Email */}
          <div>
            <Label htmlFor="username">Username</Label>
            <Input
              {...form.register("profileName", { required: true })}
              type="text"
              className="w-full mt-2"
            />
            <span className="text-sm text-muted-foreground block">
              This is your public display name.
            </span>
            <Error control={form.control} name="username" />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              {...form.register("email", { required: true })}
              className="w-full mt-2"
              disabled
            />
            <Error control={form.control} name="email" />
          </div>

          {/* Date of Birth & Phone Number */}
          <div className="mb-6 flex flex-col">
            <Label htmlFor="dateOfBirth" className="mt-2">
              Date of Birth
            </Label>
            <DatePicker
              className="w-full mt-3"
              onChange={(value) => {
                form.setValue("dateOfBirth", value);
              }}
              value={value}
            />
            <Error control={form.control} name="dateOfBirth" />
          </div>
          <div className="mb-6">
            <Label htmlFor="phoneNumber">Phone</Label>
            <Input
              {...form.register("phoneNumber", {
                required: true,
              })}
              type="number"
              className="w-full mt-2"
            />
            <Error control={form.control} name="phoneNumber" />
          </div>

          {/* Bio - This will span 2 columns */}
          <div className="col-span-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              {...form.register("bio", { required: true })}
              className="w-full mt-2 h-32"
              placeholder="Tell us about yourself, don't shy from bragging!"
            />
            <Error control={form.control} name="bio" />
          </div>
        </div>
        <div className="flex justify-center gap-4">
          <Button
            isLoading={isUpdating}
            type="submit"
            className="bg-accent-500 hover:bg-accent-700"
          >
            Update Profile
          </Button>
          <Button
            className="bg-pink-600 hover:bg-pink-700"
            onClick={(e) => {
              e.preventDefault();
              Router.push(Routes.Logout());
            }}
          >
            Logout
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};
