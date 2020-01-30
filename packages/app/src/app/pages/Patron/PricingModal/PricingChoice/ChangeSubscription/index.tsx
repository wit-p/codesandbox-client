import { format } from 'date-fns';
import React, {
  ChangeEvent,
  FunctionComponent,
  MouseEvent,
  useState,
} from 'react';

import { LinkButton } from 'app/components/LinkButton';
import { useOvermind } from 'app/overmind';

import {
  Button,
  Buttons,
  CancelText,
  Centered,
  SmallText,
  StripeInput,
  StripeInputContainer,
} from './elements';

export const ChangeSubscription: FunctionComponent = () => {
  const {
    actions: {
      modalOpened,
      patron: {
        cancelSubscriptionClicked,
        tryAgainClicked,
        updateSubscriptionClicked,
      },
    },
    state: {
      patron: { error, isUpdatingSubscription },
      user: { subscription },
    },
  } = useOvermind();
  const [coupon, setCoupon] = useState('');

  if (error) {
    return (
      <div>
        <span>There was a problem updating this subscription.</span>

        <SmallText>{error}</SmallText>

        <Buttons>
          <Button onClick={() => tryAgainClicked()}>Try again</Button>
        </Buttons>
      </div>
    );
  }

  let buttons = (
    <>
      <StripeInputContainer>
        <StripeInput
          onChange={({ target: { value } }: ChangeEvent<HTMLInputElement>) =>
            setCoupon(value)
          }
          placeholder="Apply Coupon Code"
          value={coupon}
        />
      </StripeInputContainer>

      <Buttons>
        <Button onClick={() => updateSubscriptionClicked({ coupon: '' })}>
          Update
        </Button>
      </Buttons>

      <Centered>
        <CancelText onClick={() => cancelSubscriptionClicked()}>
          Cancel my subscription
        </CancelText>
      </Centered>
    </>
  );

  if (subscription.cancelAtPeriodEnd) {
    buttons = (
      <Buttons>
        <Button onClick={() => updateSubscriptionClicked({ coupon: '' })}>
          Reactivate Subscription
        </Button>
      </Buttons>
    );
  }

  if (isUpdatingSubscription) {
    buttons = (
      <Buttons>
        <Button disabled>Processing...</Button>
      </Buttons>
    );
  }

  return (
    <div>
      {buttons}

      <SmallText>
        You will be billed every{' '}
        <strong>{format(new Date(subscription.since), 'do')}</strong> of the
        month, you can change or cancel your subscription at any time. You can
        change your payment method in{' '}
        <LinkButton
          onClick={(event: MouseEvent<HTMLButtonElement>) => {
            event.preventDefault();

            modalOpened({ modal: 'preferences', itemId: 'paymentInfo' });
          }}
        >
          user preferences
        </LinkButton>
        .
      </SmallText>
    </div>
  );
};
