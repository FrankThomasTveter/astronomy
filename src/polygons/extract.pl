#!/usr/bin/perl
# -I /usr/lib/perl/5.6.1
# -I/home/forecast/dnmi/lib/perl5/site_perl/5.6.1/IP27-irix
#
# Extract svg-icons for use in chart
#
use 5.006;
use strict;
use warnings;
 
use Math::BigFloat ':constant';
  
our $VERSION = '0.01'; 
 
sub getSqDist {
        my ($p1, $p2) = @_;
 
        my $dx = $p1->{x} - $p2->{x};
        my $dy = $p1->{y} - $p2->{y};
 
        return ($dx * $dx) + ($dy * $dy);
}
 
sub getSqSegDist {
        my ($p, $p1, $p2) = @_;
 
        my $x = $p1->{x};
        my $y = $p1->{y};
        my $dx = $p2->{x} - $x;
        my $dy = $p2->{y} - $y;
 
        if($dx != 0 || $dy != 0 ) {
 
                my $first_block = Math::BigFloat->new($p->{x} - $x);
                my $second_block = Math::BigFloat->new($p->{y} - $y);
                 
                my $first_multiply = $first_block->bmul($dx); 
                my $second_multiply = $second_block->bmul($dy);
                 
                my $top = $first_multiply->badd($second_multiply);
                my $dx_square = Math::BigFloat->new($dx)->bmul($dx);
                my $dy_square = Math::BigFloat->new($dy)->bmul($dy);
                my $bottom = $dx_square->badd($dy_square);
        #       my $t = (($p->{x} - $x) * $dx + ($p->{y} - $y) * $dy) / ($dx * $dx + $dy * $dy);
 
                my $t = $top->bdiv($bottom)->bstr();
 
                if($t > 1) {
                        $x = $p2->{x};
                        $y = $p2->{y};
                } elsif( $t > 0) {
                        $x += $dx * $t;
                        $y += $dy * $t;
                }
        }
 
        $dx = $p->{x} - $x;
        $dy = $p->{y} - $y;
 
        return ($dx * $dx) + ($dy * $dy);
}
 
sub simplifyRadialDist {
        my ( $points, $sqTolerance) = @_;
 
        my $prev_point = $points->[0];
        my $new_points = [$prev_point];
        my $point;
 
        my $len = @{$points};
        for (my $i = 1; $i < $len; $i++) {
                $point = $points->[$i];
 
                if (getSqDist($point, $prev_point) > $sqTolerance) {
                        push( @{$new_points}, $point);
                        $prev_point = $point;
                }
 
        }
         
        # If the polygon is not complete then complete it
        push (@{$new_points}, $point) if ($prev_point != $point);
 
        return $new_points;
}
 
sub simplifyDPStep {
        my ($points, $first, $last, $sqTolerance, $simplified) = @_;
 
        my $maxSqDist = $sqTolerance;
        my $index;
 
        for(my $i = $first + 1; $i < $last; $i++) {
                my $sqDist = getSqSegDist($points->[$i], $points->[$first], $points->[$last]);
 
                if ($sqDist > $maxSqDist) {
                        $index = $i;
                        $maxSqDist = $sqDist;
                }
 
        }
 
        if ($maxSqDist > $sqTolerance) {
                simplifyDPStep($points, $first, $index, $sqTolerance, $simplified);
                push @{$simplified}, $points->[$index];
                simplifyDPStep($points, $index, $sqTolerance, $simplified)
                        if($index - $first > 1);
        }
}

sub simplifyDouglasPeucker {
        my ($points, $sqTolerance) = @_;
 
        my $last = @{$points} - 1;
 
        my $simplified = [$points->[0]];
        simplifyDPStep($points, 0, $last, $sqTolerance, $simplified);
        push @{$simplified}, $points->[$last];
 
        return $simplified;
 
}
 
sub simplify {
        my ($points, $tolerance, $highestQuality) = @_;
 
        return $points if (@{$points} <= 2);
 
        my $sqTolerance = 1;
 
        if ( $tolerance ) {
                $sqTolerance = $tolerance * $tolerance;
        }
 
        $points = $highestQuality ? $points : simplifyRadialDist($points, $sqTolerance);
        $points = simplifyDouglasPeucker($points, $sqTolerance);
 
        return $points;
 
 
}
 
sub Usage {                      
    print STDERR "
Usage: extract.pl inpu.csv output.xml

extract takes a csv-file and creates xml-output ...
\n";                             
    exit 1;                      
}                                
#
my $step = 1;
my $input=shift @ARGV;
my $output=shift @ARGV;
my $extra=shift @ARGV;
if ($input && $output) {
    if (-f $input && $input =~ m/(.*)\.csv/) {
	my $value=$1;
	my $str="";
	open(FH, '<', $input) or die $!;
	while (my $line=<FH>){
	    $str=$str . $line;
	};
	close(FH);
	my @points=();
	my $cnt=0;
	while ($str =~ m/(\d+\.?\d+)\s(\d+\.?\d+)/g) {
	    $cnt=$cnt+1;
	    my $lat=($2 + 0);
	    my $lng=($1 + 0)/2;
	    if ((($cnt)%($step)) == 0) {push(@points,{x=>$lng,y=>$lat});};
	    #print ($cnt . "  Lng:$lng Lat:$lat\n");
	}
	#die "Debug";
	#print ("\"$value\":\"$str\",\n");
	my $ff=360.0/40000.0;
	my $tolerance=0.0005*$ff; # 0.10km 
	my $simp = simplifyRadialDist(\@points, $tolerance);
	#my $simp = simplifyDouglasPeucker(\@points, $tolerance);
	my $scnt=scalar(@{$simp});
	# write xml
	if ($output) {
	    open(FH, '>', $output) or die $!;
	    print FH "<polygon volume=\"inside\">\n";
	    foreach my $point (@{$simp}) {
		my $lat=$point->{"y"};
		my $lng=($point->{"x"})*2;
		#print "$lng, $lat\n";
		print FH " <node lon=\"$lng\" lat=\"$lat\"/>\n";
	    }
	    print FH "</polygon>\n";
	    close(FH);
	};
	#
	if ($extra) {
	    open(FH, '>', $extra) or die $!;
	    foreach my $point (@{$simp}) {
		my $lat=$point->{"y"};
		my $lng=($point->{"x"})*2;
		print FH "$lng, $lat\n";
	    }
	    close(FH);
	};
	print "$input:$cnt -> $output:$scnt (" . sprintf("%.3f",100*$scnt/$cnt) . "%)\n";
    }
}
