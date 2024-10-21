class PaymentsController < ApplicationController
    def create_checkout_session
        session = Stripe::Checkout::Session.create(
            payment_method_types: ['card'],
            shipping_address_collection: {
                allowed_countries: ['US'],
            },
            shipping_options: [
                {
                    shipping_rate_data: {
                        type: 'fixed_amount',
                        fixed_amount: {
                            amount: 0,
                            currency: 'usd',
                        },
                        display_name: 'Free Shipping',
                        delivery_estimate: {
                            minimum: {
                            unit: 'business_day',
                            value: 3,
                            },
                            maximum: {
                            unit: 'business_day',
                            value: 5,
                            },
                        },
                    },
                },
            ],
            line_items: [{
                price: params[:price_id],
                quantity: 1,
                adjustable_quantity: {
                    enabled: true,
                    minimum: 1,
                    maximum: 10,
                },
            }],
            payment_intent_data: {
                description: 'Photograph Purchase',
                metadata: {
                    'photograph_key' => params[:photo_key],
                },
            },
            mode: 'payment',
            success_url:'https://henryescobar.studio/checkout/success?session_id={CHECKOUT_SESSION_ID}',
            cancel_url: 'https://henryescobar.studio/portfolio',
        )
        render json: { id: session.id }
    rescue Stripe::StripeError => e
        Rails.logger.error "Error creating checkout session: #{e.message}, params: #{params.inspect}"
        render json: {error: e.message}, status: :bad_request
    end

    def checkout_success
        session_id = params[:session_id]
        begin
            stripe_session = Stripe::Checkout::Session.retrieve(session_id)

            render json: {
                payment_status: stripe_session.payment_status,
                customer_details: stripe_session.customer_details
            }
        rescue Stripe::StripeError => e
            Rails.logger.error "Error retrieving checkout session: #{e.message}, params: #{params.inspect}"
            render json: {error: e.message}, status: :bad_request
        end
    end
end
