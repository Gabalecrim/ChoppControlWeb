import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

export default function Settings() {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2 p-4">
            <div className="flex flex-col gap-4">
              <div>
                <h1 className="text-3xl font-bold">Configurações</h1>
                <p className="text-muted-foreground mt-2">
                  Gerencie as configurações do sistema
                </p>
              </div>
              
              <div className="border rounded-lg p-6 space-y-4">
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold">Configurações Gerais</h2>
                  <p className="text-sm text-muted-foreground">
                    Configure as opções gerais do sistema aqui
                  </p>
                </div>
                
                {/* Adicione seus componentes de configuração aqui */}
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
