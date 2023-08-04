"use client"

import { useState } from 'react'
import { type Store } from "@/db/schema"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LoadingButton } from "@/components/ui/loading-button"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"

interface UpdateStoreFormProps {
    store: Pick<Store, 'id' | 'name' | 'description'>
    updateStore: (fd: FormData) => Promise<void>
    deleteStore: () => Promise<void>
}

export function UpdateStoreForm({
    store,
    updateStore,
    deleteStore,
}: UpdateStoreFormProps) {
    const [isDisabled, setIsDisabled] = useState(true);

    const handleSwitchChange = (checked: boolean) => {
        setIsDisabled(!checked)
    }
    return (
        <form
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            action={updateStore}
            className="grid w-full max-w-xl gap-5"
        >
            <fieldset className="grid gap-2.5">
                <Label htmlFor="update-store-name">Name</Label>
                <Input
                    id="update-store-name"
                    aria-describedby="update-store-name-description"
                    name="name"
                    required
                    minLength={3}
                    maxLength={50}
                    placeholder="Type store name here."
                    defaultValue={store.name}
                />
            </fieldset>
            <fieldset className="grid gap-2.5">
                <Label htmlFor="update-store-description">Description</Label>
                <Textarea
                    id="update-store-description"
                    aria-describedby="update-store-description-description"
                    name="description"
                    minLength={3}
                    maxLength={255}
                    placeholder="Type store description here."
                    defaultValue={store.description ?? ""}
                />
            </fieldset>
            <div className="flex space-x-2">
                <LoadingButton>
                    Update Store
                    <span className="sr-only">Update store</span>
                </LoadingButton>
                <LoadingButton
                    // eslint-disable-next-line @typescript-eslint/no-misused-promises
                    id="delete-store"
                    formAction={() => {
                        deleteStore().catch(e => {
                            console.error(e)
                        })
                    }}
                    variant="destructive"
                    disabled={isDisabled}
                >
                    Delete Store
                    <span className="sr-only">Delete store</span>
                </LoadingButton>
                <div className="flex flex-col items-center justify-between">
                    <Label className='text-[0.6rem] text-muted-foreground'>Allow Delete</Label>
                    <Switch
                        checked={!isDisabled}
                        onCheckedChange={handleSwitchChange}
                        className="data-[state=checked]:bg-destructive"
                    />
                </div>
            </div>
        </form>
    )
}