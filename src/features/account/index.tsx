import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Separator } from "@/components/ui/separator";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import validator from "validator";
import { AccountForm } from "@/features/account/AccountForm";
import { PreferencesForm } from "@/features/account/PreferencesForm";
import { useQuery } from "@tanstack/react-query";
import { QueryKeys } from "@/lib/queryKeys";
import { pick } from "lodash";
import { parseISO, subDays } from "date-fns";
import { NextSeo } from "next-seo";
import user from "@/api/routes/user";
import { AccountsHeader } from "@/features/account/components/header";
import Billing from "@/features/account/components/billing";

const profileSchema = z.object({
  profileName: z
    .string({ required_error: "Username is required" })
    .min(1, "Please enter username"),
  email: z
    .string({ required_error: "Email is required" })
    .email("Invalid email"),
  bio: z
    .string({ required_error: "Bio is required" })
    .max(1500, "Bio should be less than 1500 character"),
  name: z
    .string({ required_error: "First name is required" })
    .min(1, "First name is required"),
  lastName: z
    .string({ required_error: "Last name is required" })
    .min(1, "Last name is required"),
  phoneNumber: z
    .string({ required_error: "Phone is required" })
    .regex(
      /^\+?\d{1,4}?[-.\s]?((\(?\d{1,3}?\)?[-.\s]?)?(\d{1,4}[-.\s]?)*\d{1,4}|\d{10})$/,
      "Invalid Phone number"
    )
    .refine(validator.isMobilePhone),
  dateOfBirth: z
    .date({ required_error: "DOB is required" })
    .max(subDays(new Date(), 1), "Invalid DOB"),
});

const preferenceSchema = z.object({
  storyVisibility: z.boolean(),
  amazonStatus: z.boolean(),
  tokenPurchase: z.boolean(),
  tokenUsage: z.boolean(),
  lowBalance: z.boolean(),
  storyGenerated: z.boolean(),
  reportUpdated: z.boolean(),
  commentUsage: z.boolean(),
});

type Account = z.infer<typeof profileSchema>;

const AccountsPage = () => {
  const router = useRouter();
  const { step = "profile" } = router.query ?? {};

  const { data, isPending, refetch } = useQuery({
    queryKey: [QueryKeys.USER],
    queryFn: () => user.get(),
  });

  const basicDetails: Record<string, any> = useMemo(() => {
    if (!data?.data) {
      return {};
    }
    const _basicDetails: Record<string, any> = pick(data.data, [
      "name",
      "email",
      "lastName",
      "bio",
      "profileName",
      "phoneNumber",
      "dateOfBirth",
    ]);

    if (_basicDetails?.dateOfBirth) {
      _basicDetails["dateOfBirth"] = parseISO(_basicDetails.dateOfBirth);
    }

    return _basicDetails;
  }, [data]);

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: basicDetails,
  });

  useEffect(() => {
    if (Object.keys(basicDetails).length === 0) {
      return;
    }
    form.reset(basicDetails);
  }, [form, basicDetails]);

  const preferenceForm = useForm({
    resolver: zodResolver(preferenceSchema),
    defaultValues: {
      storyVisibility: true,
      amazonStatus: true,
      tokenPurchase: false,
      tokenUsage: false,
      lowBalance: false,
      storyGenerated: false,
      reportUpdated: false,
      commentUsage: true,
    },
  });
  useEffect(() => {
    if (!router.isReady) {
      return;
    }
  }, [router]);

  const onClickNavMenu = useCallback(
    (item: string) => {
      router.query.step = item;
      router.push(router);
    },
    [router]
  );

  if (!data?.data) {
    return null;
  }

  return (
    <div className="h-full flex flex-col">
      <NextSeo
        title="Profile Settings"
        description="Manage your account settings and set e-mail preferences."
      />
      <AccountsHeader user={data?.data} />
      <div className="flex flex-grow">
        <div className="w-full h-full bg-background p-8 lg:p-14">
          <p className="text-3xl font-bold">Settings</p>
          <p className="text-base font-extralight text-muted-foreground">
            Manage your account settings and set e-mail preferences.
          </p>
          <hr className="mt-2 lg:mt-8" />
          <div className="flex flex-col sm:flex-row">
            {/* Toggle Group: Adjust for mobile and larger screens */}
            <div className="w-full sm:w-2/12">
              <ToggleGroup
                value={step as string}
                type="single"
                className="flex flex-row sm:flex-col space-x-2 sm:space-x-0 space-y-0 sm:space-y-2 mt-5"
                onValueChange={onClickNavMenu}
              >
                <ToggleGroupItem
                  value="profile"
                  className="justify-center sm:justify-start text-center sm:text-left w-full"
                >
                  Profile
                </ToggleGroupItem>

                <ToggleGroupItem
                  value="payment"
                  className="justify-center sm:justify-start text-center sm:text-left w-full"
                >
                  Billing
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="preferences"
                  className="justify-center sm:justify-start text-center sm:text-left w-full"
                >
                  Notification Preferences
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
            {isPending ? (
              <p className="ml-28 mt-10">Loading...</p>
            ) : (
              <div
                id="tab-section"
                className="mt-8 sm:mt-0 sm:ml-28 w-full sm:w-4/6"
              >
                <div className="lg:py-8">
                  {step === "profile" && (
                    <>
                      <div className="hidden lg:block">
                        <p className="text-2xl font-bold">Profile</p>
                        <p className="text-base font-extralight text-muted-foreground">
                          This is how others will see you on the site.
                        </p>
                        <Separator className="my-8" />
                      </div>
                      <AccountForm<Account> form={form} refetch={refetch} />
                    </>
                  )}

                  {step === "payment" && <Billing />}

                  {step === "preferences" && (
                    <>
                      <PreferencesForm form={preferenceForm} />
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountsPage;
