# UML - GoFs Criacionais no AcessibilidadeJa

Este diagrama mostra onde os padroes GoF criacionais foram aplicados no widget `public/widget/acessibilidadeja.js`.

| Nome original | Nome em portugues usado no projeto |
| --- | --- |
| Singleton | Instancia Unica |
| Factory Method | Metodo Fabrica |
| Prototype | Prototipo |
| Abstract Factory | Fabrica Abstrata |
| Builder | Construtor / Montador |

```mermaid
classDiagram
    direction LR

    class WidgetSingleton {
        <<Singleton / Instancia Unica>>
        +estaPronto() boolean
        +marcarPronto() void
    }

    class BrowserWindow {
        +__AcessibilidadeJa__ boolean
        +AcessibilidadeJa AcessibilidadeJaAPI
        +AcessibilidadeJaConfig object
    }

    class AcessibilidadeJaAPI {
        +abrir() void
        +fechar() void
        +redefinir() void
        +open() void
        +close() void
        +reset() void
    }

    class IconFactory {
        <<Factory Method / Metodo Fabrica>>
        +icones object
        +criar(nome) string
    }

    class OptionsPrototype {
        <<Prototype / Prototipo>>
        +tipo string
        +clonar(propriedades) object
    }

    class ToggleOption {
        +secao string
        +chave string
        +icone string
        +rotulo string
        +tipo string
    }

    class WidgetElementFactory {
        <<Abstract Factory / Fabrica Abstrata>>
        +criarEstilo(conteudo) HTMLStyleElement
        +criarRaiz() HTMLDivElement
        +criarScriptExterno(id, origem) HTMLScriptElement
        +criarGuia() HTMLDivElement
        +criarAlvoDeTraducaoOculto() HTMLDivElement
    }

    class WidgetBuilder {
        <<Builder / Construtor-Montador>>
        -fabrica WidgetElementFactory
        -fabricaDeIcones IconFactory
        -raiz HTMLElement
        +montarEstilos(conteudo) WidgetBuilder
        +montarRaiz() WidgetBuilder
        +construirSecoesAlternar() string
        +renderizar() HTMLElement
    }

    class WidgetTemplates {
        +botaoAlternar(opcao, fabricaDeIcones) string
        +controleZoom() string
        +tradutor(fabricaDeIcones) string
        +estrutura(fabricaDeIcones, secoesAlternar) string
    }

    WidgetSingleton ..> BrowserWindow : controla instancia unica
    AcessibilidadeJaAPI ..> BrowserWindow : exposta globalmente
    OptionsPrototype ..> ToggleOption : clona
    WidgetBuilder --> WidgetElementFactory : usa Fabrica Abstrata
    WidgetBuilder --> IconFactory : usa Metodo Fabrica
    WidgetBuilder --> WidgetTemplates : monta HTML
    WidgetTemplates --> ToggleOption : renderiza opcoes
    WidgetTemplates --> IconFactory : cria SVGs
```

## Relacao com os GoFs Criacionais

| Padrao em portugues | Nome GoF original | Elemento no projeto | Responsabilidade |
| --- | --- | --- | --- |
| Instancia Unica | Singleton | `WidgetSingleton` | Garante que o widget seja inicializado apenas uma vez na pagina. |
| Metodo Fabrica | Factory Method | `IconFactory.criar(nome)` | Cria o SVG correto a partir do nome do icone. |
| Prototipo | Prototype | `OptionsPrototype.clonar(propriedades)` | Cria novas opcoes do menu copiando uma estrutura base. |
| Fabrica Abstrata | Abstract Factory | `WidgetElementFactory` | Centraliza a criacao de elementos relacionados ao widget. |
| Construtor / Montador | Builder | `WidgetBuilder` | Monta o widget em etapas: estilos, raiz, secoes e interface final. |

## Fluxo Resumido

```mermaid
sequenceDiagram
    participant Script as acessibilidadeja.js
    participant Singleton as WidgetSingleton
    participant Builder as WidgetBuilder
    participant Fabrica as WidgetElementFactory
    participant Icones as IconFactory
    participant DOM as DOM
    participant API as window.AcessibilidadeJa

    Script->>Singleton: estaPronto()
    alt widget ja existe
        Singleton-->>Script: true
        Script-->>Script: encerra execucao
    else primeira inicializacao
        Script->>Singleton: marcarPronto()
        Script->>Builder: new WidgetBuilder(fabrica, fabricaDeIcones)
        Builder->>Fabrica: criarEstilo(css)
        Fabrica-->>DOM: style
        Builder->>Fabrica: criarRaiz()
        Fabrica-->>DOM: raiz
        Builder->>Icones: criar(nome)
        Icones-->>Builder: SVG
        Builder->>DOM: renderizar()
        Script->>API: expor abrir(), fechar(), redefinir()
    end
```
