import { CheckCircle2, Plus } from "lucide-react";
import { Button } from "./ui/button";
import { DialogTrigger } from "./ui/dialog";
import { Progress, ProgressIndicator } from "./ui/progress-bar";
import { Separator } from "./ui/separator";
import { OutlineButton } from "./ui/outline-button";
import { Logo } from "./ui/logo-component";

export function Summary() {

    const progressMax = 32
    const progressActual = 8
    const progressIndicator = ((progressActual * 480) / progressMax)
    const progressIndicatorPerCent = ((progressActual * 100) / progressMax)

    return (
        <div className="py-10 max-w-[480px] px-5 mx-auto flex flex-col gap-6">
            <div className=" flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Logo />
                    <span className="text-lg font-semibold"> 5 a 10 de Agosto</span>
                </div>
                <DialogTrigger asChild>
                    <Button size="sm">
                        <Plus className="size-4" />
                        Cadastrar meta
                    </Button>
                </DialogTrigger>
            </div>
            <div className="flex flex-col gap-3">
                <Progress value={progressIndicator} max={progressMax}>
                    <ProgressIndicator style={{ width: progressIndicator }} />
                </Progress>
                <div className="flex items-center justify-between text-xs text-zinc-400">
                    <span>Você completou <span className="text-zinc-100">{progressActual}</span> de <span className="text-zinc-100">{progressMax}</span> metas nessa semana.</span>
                    <span>{progressIndicatorPerCent}%</span>
                </div>
            </div>
            <Separator />
            <div className="flex flex-wrap gap-3">
                <OutlineButton> <Plus className="size-4 text-zinc-600" />Meditar</OutlineButton>
                <OutlineButton> <Plus className="size-4 text-zinc-600" />Meditar</OutlineButton>
                <OutlineButton> <Plus className="size-4 text-zinc-600" />Me alimentar bem</OutlineButton>
                <OutlineButton> <Plus className="size-4 text-zinc-600" />Me alimentar bem</OutlineButton>
                <OutlineButton> <Plus className="size-4 text-zinc-600" />Me alimentar bem</OutlineButton>
            </div>

            <div className="flex flex-col gap-6">
                <h2 className="text-xl font-medium">Sua semana</h2>
                <div className="flex flex-col gap-4">
                    <h3 className="font-medium">
                        Domingo {' '}
                        <span className="text-zinc-400 text-xs">(10 de Agosto)</span></h3>
                    <ul className="flex flex-col gap-3">
                        <li className="flex item-center gap-2">
                            <CheckCircle2 className="size-4 text-pink-500" />
                            <span className="text-sm text-zinc-400">
                                Você completou "<span className="text-zinc-100">meditar</span>" às <span className="text-zinc-100">11:11</span>
                            </span>
                        </li>
                    </ul>
                </div>
            </div>

        </div>

    )
}