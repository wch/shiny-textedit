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

  output$editor_content <- render_json({
    input$code_content
  })

  # Process cursor context for LLM autocomplete
  output$cursor_info <- render_json({
    ctx <- input$cursor_context

    if (is.null(ctx)) {
      return("Waiting for cursor context...")
    }

    # Format cursor information
    info <- paste0(
      "Cursor Position:\n",
      "  Line: ",
      ctx$line,
      "\n",
      "  Column: ",
      ctx$column,
      "\n",
      "  Language: ",
      ctx$language,
      "\n\n",
      "Context Summary:\n",
      "  Prefix length: ",
      nchar(ctx$prefix),
      " chars\n",
      "  Suffix length: ",
      nchar(ctx$suffix),
      " chars\n\n",
      "Ready for LLM integration!\n",
      "This context can be sent to an LLM API for code completion."
    )

    info
  })
}

shinyApp(ui = page_react(title = "Shiny Code Editor"), server = server)
