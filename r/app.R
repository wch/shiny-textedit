library(shiny)

source("shinyreact.R", local = TRUE)

server <- function(input, output, session) {
  # Calculate line count from code content
  output$line_count <- render_json({
    code <- input$code_content
    if (is.null(code) || code == "") {
      return(0)
    }

    # Count lines by splitting on newlines
    lines <- strsplit(code, "\n")[[1]]
    length(lines)
  })

  # Calculate character count from code content
  output$char_count <- render_json({
    code <- input$code_content
    if (is.null(code) || code == "") {
      return(0)
    }

    nchar(code)
  })

  # Calculate word count from code content
  output$word_count <- render_json({
    code <- input$code_content
    if (is.null(code) || code == "") {
      return(0)
    }

    # Count words by splitting on whitespace
    words <- strsplit(code, "\\s+")[[1]]
    words <- words[nchar(words) > 0]
    length(words)
  })
}

shinyApp(ui = page_react(title = "Shiny Code Editor"), server = server)
