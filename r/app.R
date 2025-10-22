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

  # Separate outputs for UI display
  output$cursor_position <- render_json({
    ctx <- input$cursor_context
    if (is.null(ctx)) return(NULL)

    list(
      line = ctx$line,
      column = ctx$column,
      language = ctx$language
    )
  })

  output$current_selections <- render_json({
    ctx <- input$cursor_context
    if (is.null(ctx)) return(NULL)

    ctx$selections
  })

  output$context_prefix <- render_json({
    ctx <- input$cursor_context
    if (is.null(ctx)) return(NULL)

    ctx$prefix
  })

  output$context_suffix <- render_json({
    ctx <- input$cursor_context
    if (is.null(ctx)) return(NULL)

    ctx$suffix
  })

  output$recent_edits_server <- render_json({
    ctx <- input$cursor_context
    if (is.null(ctx)) return(NULL)

    ctx$recentEdits
  })

  # Process cursor context for LLM autocomplete (FIM format)
  output$cursor_info <- render_json({
    ctx <- input$cursor_context

    if (is.null(ctx)) {
      return("Waiting for cursor context...")
    }

    # FIM (Fill-in-Middle) format optimized for code completion LLMs
    info_parts <- c(
      paste0("Language: ", ctx$language),
      paste0("Line: ", ctx$line, ", Column: ", ctx$column),
      "",
      "<|fim_prefix|>",
      ctx$prefix,
      "<|fim_suffix|>",
      ctx$suffix,
      "<|fim_middle|>"
    )

    # Add selection information if present
    has_selections <- !is.null(ctx$selections) && length(ctx$selections) > 0
    has_text_selected <- FALSE

    if (has_selections) {
      for (sel in ctx$selections) {
        if (nchar(sel$text) > 0) {
          has_text_selected <- TRUE
          break
        }
      }
    }

    if (has_text_selected) {
      info_parts <- c(
        info_parts,
        "",
        "---",
        "SELECTED TEXT:"
      )

      for (i in seq_along(ctx$selections)) {
        sel <- ctx$selections[[i]]
        if (nchar(sel$text) > 0) {
          info_parts <- c(
            info_parts,
            paste0("Selection ", i, " (Line ", sel$fromLine, ":", sel$fromColumn,
                   " → ", sel$toLine, ":", sel$toColumn, "):"),
            sel$text
          )
        }
      }
    }

    # Add recent edits information (newest first)
    if (!is.null(ctx$recentEdits) && length(ctx$recentEdits) > 0) {
      info_parts <- c(
        info_parts,
        "",
        "---",
        "RECENT EDITS:"
      )

      # Show last 5 edits in reverse order (newest first)
      num_to_show <- min(5, length(ctx$recentEdits))
      for (i in seq_len(num_to_show)) {
        edit <- ctx$recentEdits[[length(ctx$recentEdits) - i + 1]]

        # Format as one-line transformation
        if (nchar(edit$remove) > 0 && nchar(edit$insert) > 0) {
          info_parts <- c(
            info_parts,
            paste0("- Edit ", i, " (pos ", edit$from, "-", edit$to, "): \"",
                   edit$remove, "\" → \"", edit$insert, "\"")
          )
        } else if (nchar(edit$insert) > 0) {
          info_parts <- c(
            info_parts,
            paste0("- Edit ", i, " (pos ", edit$from, "): inserted \"", edit$insert, "\"")
          )
        } else if (nchar(edit$remove) > 0) {
          info_parts <- c(
            info_parts,
            paste0("- Edit ", i, " (pos ", edit$from, "-", edit$to, "): deleted \"",
                   edit$remove, "\"")
          )
        }
      }
    }

    paste(info_parts, collapse = "\n")
  })
}

shinyApp(ui = page_react(title = "Shiny Code Editor"), server = server)
