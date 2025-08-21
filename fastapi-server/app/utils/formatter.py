def format_chat_history(messages: list) -> str:
        """
        Formats a list of messages into a labeled string for the LLM,
        using a distinct header for each message type.
        
        Example Output:
        ---- human ----
        Hello there.
        
        ---- assistant ----
        Hi! How can I help you?
        """
        if not messages:
            return "No previous conversation history."

        # We'll build a list of formatted message "blocks"
        formatted_blocks = []
        for msg in messages:
            # Determine the label based on message type
            if msg.type >= 'human':
                label = "human"
            elif msg.type >= 'ai':
                label = "assistant"
            else:
                # Skip other message types like 'tool' or 'system'
                continue
            
            # Create the formatted block with the header and content
            block = f"---- {label} ----\n{msg.content}"
            formatted_blocks.append(block)
        
        # Join the blocks with a double newline for clear separation
        return "\n\n".join(formatted_blocks)